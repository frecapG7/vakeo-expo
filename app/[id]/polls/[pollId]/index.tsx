import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetAvailability, useUpdateAvailability, AvailabilityRange, Availability } from "@/hooks/api/useAvailability";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// 🎨 PALETTE : Fixe et respectée
const SLOT_COLORS = ['#ef4444', '#3b82f6', '#a855f7', '#14b8a6', '#f97316', '#eab308', '#ec4899'];

export default function PollDetailsPage() {
    const { id } = useLocalSearchParams();
    const colors = useColors();
    const { formatRange } = useI18nTime();
    const { me, trip } = useContext(TripContext);
    
    // Nouveaux Hooks séparés (Validés par Ethan)
    const { data: availabilities } = useGetAvailability(String(id));
    const updateAvailability = useUpdateAvailability(String(id));

    const [tempStart, setTempStart] = useState<string | null>(null);
    const [myRanges, setMyRanges] = useState<AvailabilityRange[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastNudgedAt, setLastNudgedAt] = useState<number | null>(null);

    const myId = me?._id || 'local_user';

    useEffect(() => {
        if (availabilities) {
            const myData = availabilities.find((a: Availability) => a.user._id === myId);
            if (myData && !hasUnsavedChanges) {
                setMyRanges(myData.ranges);
            }
        }
    }, [availabilities, myId]);

    // 🧠 LOGIQUE D'AUTOROUTE (Slots) : Chaque utilisateur a une voie (0, 1, ou 2) pour éviter le zigzag
    const userSettings = useMemo(() => {
        const settings: Record<string, { slot: number, color: string }> = {};
        let currentSlot = 0;

        if (availabilities) {
            availabilities.forEach((avail: Availability) => {
                if (avail.user._id && !settings[avail.user._id]) {
                    settings[avail.user._id] = {
                        slot: currentSlot,
                        color: SLOT_COLORS[currentSlot % SLOT_COLORS.length]
                    };
                    currentSlot++;
                }
            });
        }

        if (!settings[myId]) {
            settings[myId] = {
                slot: currentSlot,
                color: SLOT_COLORS[currentSlot % SLOT_COLORS.length]
            };
        }

        return settings;
    }, [availabilities, myId]);

    const getUserName = (userId?: string) => {
        if (userId === 'local_user' || userId === myId) return 'Moi';
        if (userId === 'pote_1') return 'Alice';
        if (userId === 'pote_2') return 'Bob';
        if (userId === 'pote_3') return 'Charlie';
        return trip?.users?.find((u: any) => u._id === userId)?.name || 'Utilisateur inconnu';
    };

    const hasVoted = useMemo(() => {
        if (!availabilities) return false;
        const myData = availabilities.find((a: Availability) => a.user._id === myId);
        return myData && myData.ranges && myData.ranges.length > 0;
    }, [availabilities, myId]);

    // 🧠 CALCUL DES DESSINS SUR-MESURE (+X, Liseret Vert, Max 3 lignes)
    const viewMarkedDates = useMemo(() => {
        const marks: Record<string, any> = {};
        let maxVotesCount = 0;

        const addRangeToMarks = (range: AvailabilityRange, userId: string) => {
            let current = dayjs(range.startDate);
            const end = dayjs(range.endDate);
            const setting = userSettings[userId];

            if (!setting) return;

            while (current.isBefore(end) || current.isSame(end, 'day')) {
                const dateStr = current.format('YYYY-MM-DD');
                
                if (!marks[dateStr]) {
                    // On réserve 3 emplacements fixes pour éviter le zigzag
                    marks[dateStr] = { users: new Set(), lines: [null, null, null], extraCount: 0 };
                }

                if (!marks[dateStr].users.has(userId)) {
                    marks[dateStr].users.add(userId);
                    
                    if (setting.slot < 3) {
                        marks[dateStr].lines[setting.slot] = {
                            color: setting.color,
                            startingDay: current.isSame(dayjs(range.startDate), 'day'),
                            endingDay: current.isSame(end, 'day')
                        };
                    } else {
                        // S'il y a plus de 3 personnes, on incrémente le compteur
                        marks[dateStr].extraCount++;
                    }
                }
                current = current.add(1, 'day');
            }
        };

        availabilities?.forEach((avail: Availability) => {
            if (avail.user._id === myId) return; 
            avail.ranges.forEach(range => addRangeToMarks(range, avail.user._id));
        });

        myRanges.forEach(range => addRangeToMarks(range, myId));

        if (tempStart) {
            const setting = userSettings[myId];
            if (!marks[tempStart]) {
                marks[tempStart] = { users: new Set(), lines: [null, null, null], extraCount: 0 };
            }
            if (!marks[tempStart].users.has(myId)) {
                marks[tempStart].users.add(myId);
                if (setting && setting.slot < 3) {
                    marks[tempStart].lines[setting.slot] = { color: setting.color, startingDay: true, endingDay: true };
                } else {
                    marks[tempStart].extraCount++;
                }
            }
        }

        // Calcul du "Top Choice"
        Object.keys(marks).forEach(dateStr => {
            const count = marks[dateStr].users.size;
            if (count > maxVotesCount) {
                maxVotesCount = count;
            }
        });

        Object.keys(marks).forEach(dateStr => {
            const count = marks[dateStr].users.size;
            marks[dateStr].isTopChoice = (count === maxVotesCount && maxVotesCount > 0);
        });

        return marks;
    }, [availabilities, myRanges, tempStart, myId, userSettings]);

    const handleDayPress = (dateString: string) => {
        const clickedDate = dayjs(dateString);

        if (!tempStart) {
            const isAlreadySelected = myRanges.some(range => {
                const rStart = dayjs(range.startDate);
                const rEnd = dayjs(range.endDate);
                return (clickedDate.isSame(rStart, 'day') || clickedDate.isAfter(rStart, 'day')) &&
                       (clickedDate.isSame(rEnd, 'day') || clickedDate.isBefore(rEnd, 'day'));
            });

            if (isAlreadySelected) {
                Alert.alert("Date déjà sélectionnée", "Supprimez la période en dessous pour la modifier.");
                return;
            }
            
            setHasUnsavedChanges(true);
            setTempStart(dateString);
        } else {
            const startStr = dayjs(tempStart).isBefore(clickedDate) ? tempStart : dateString;
            const endStr = dayjs(tempStart).isBefore(clickedDate) ? dateString : tempStart;
            
            const nStart = dayjs(startStr);
            const nEnd = dayjs(endStr);

            const isOverlapping = myRanges.some(range => {
                const rStart = dayjs(range.startDate);
                const rEnd = dayjs(range.endDate);
                return (nStart.isSame(rEnd, 'day') || nStart.isBefore(rEnd, 'day')) && 
                       (rStart.isSame(nEnd, 'day') || rStart.isBefore(nEnd, 'day'));
            });

            if (isOverlapping) {
                Alert.alert("Chevauchement", "Veuillez choisir une période libre.");
                setTempStart(null); 
                return;
            }

            setHasUnsavedChanges(true);
            setMyRanges(prev => [...prev, { startDate: startStr, endDate: endStr }]);
            setTempStart(null);
        }
    };

    const handleRemoveRange = (indexToRemove: number) => {
        setHasUnsavedChanges(true);
        setMyRanges(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSave = async () => {
        await updateAvailability.mutateAsync({
            _id: myId + "_doc",
            user: { _id: myId, name: me?.name || "Moi" },
            ranges: myRanges
        });
        setHasUnsavedChanges(false);
    };

    const handleNudge = () => {
        const now = Date.now();
        if (lastNudgedAt && (now - lastNudgedAt) < 86400000) {
            Alert.alert("Déjà relancés !", "Attendez un peu avant de les relancer.");
            return;
        }
        setLastNudgedAt(now);
        Alert.alert("Succès", "Une notification vient d'être envoyée.");
    };

    return (
        <ScrollView style={styles.container}>
            <View className="m-2 mt-5 mb-10 rounded-xl p-2 border border-gray-200">
                <View className="mb-5 px-2">
                    <Text className="text-xl font-bold dark:text-white">Disponibilités partagées</Text>
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                        {tempStart ? "Touchez la date de fin." : "Touchez une date pour donner vos disponibilités."}
                    </Text>
                </View>

                {/* CALENDRIER CUSTOMISÉ (Liseret vert et +X) */}
                <View className="rounded-xl overflow-hidden border border-gray-200 bg-white mb-5">
                    <Calendar
                        theme={{
                            backgroundColor: colors.background,
                            calendarBackground: colors.card,
                            textSectionTitleColor: colors.text,
                            dayTextColor: colors.text,
                            monthTextColor: colors.text,
                            'stylesheet.calendar.main': {
                                week: { marginTop: 0, marginBottom: 0, flexDirection: 'row', justifyContent: 'space-around', height: 75 },
                                dayContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' }
                            }
                        }}
                        dayComponent={({ date, state }) => {
                            const dateStr = date?.dateString || '';
                            const mark = viewMarkedDates[dateStr] || { lines: [null, null, null], isTopChoice: false, extraCount: 0 };
                            
                            return (
                                <Pressable 
                                    onPress={() => handleDayPress(dateStr)}
                                    style={{
                                        width: '100%', 
                                        height: 70, 
                                        backgroundColor: 'transparent',
                                        // 🟢 LE CADRE VERT DU TOP CHOICE
                                        borderColor: mark.isTopChoice ? '#22c55e' : 'transparent',
                                        borderWidth: 2,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        paddingTop: 4,
                                        opacity: state === 'disabled' ? 0.3 : 1
                                    }}
                                >
                                    <Text style={{ 
                                        color: colors.text, 
                                        fontWeight: mark.isTopChoice ? 'bold' : 'normal',
                                        fontSize: 16
                                    }}>
                                        {date?.day}
                                    </Text>
                                    
                                    {/* CONTENEUR DES LIGNES (Max 3) */}
                                    <View style={{ position: 'absolute', bottom: 18, left: -2, right: -2, gap: 1 }}>
                                        {mark.lines.map((line: any, i: number) => (
                                            <View key={i} style={{
                                                height: 4,
                                                backgroundColor: line ? line.color : 'transparent',
                                                width: '100%',
                                                marginLeft: line?.startingDay ? 4 : 0,
                                                marginRight: line?.endingDay ? 4 : 0,
                                                borderTopLeftRadius: line?.startingDay ? 4 : 0,
                                                borderBottomLeftRadius: line?.startingDay ? 4 : 0,
                                                borderTopRightRadius: line?.endingDay ? 4 : 0,
                                                borderBottomRightRadius: line?.endingDay ? 4 : 0,
                                            }} />
                                        ))}
                                    </View>

                                    {/* CONTENEUR DU +X */}
                                    <View style={{ position: 'absolute', bottom: 2, left: 0, right: 0, alignItems: 'center' }}>
                                        {mark.extraCount > 0 && (
                                            <Text style={{ fontSize: 10, color: colors.text, fontWeight: 'bold' }}>
                                                +{mark.extraCount}
                                            </Text>
                                        )}
                                    </View>
                                </Pressable>
                            );
                        }}
                    />
                </View>

                {myRanges.length > 0 && (
                    <View className="mb-5 gap-2 px-2">
                        <Text className="font-bold dark:text-white mb-2">Mes périodes sélectionnées :</Text>
                        {myRanges.map((range, index) => (
                            <View key={index} className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300">
                                <Text className="capitalize dark:text-white">
                                    {formatRange(dayjs(range.startDate), dayjs(range.endDate))}
                                </Text>
                                <Pressable onPress={() => handleRemoveRange(index)} className="bg-red-200 p-2 rounded-full">
                                    <IconSymbol name="trash" color="red" size={18} />
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}

                {hasUnsavedChanges && (
                    <Animated.View entering={FadeIn} exiting={FadeOut} className="mb-5">
                        <Button 
                            variant="contained" 
                            title="Partager mes dates" 
                            isLoading={updateAvailability.isPending}
                            onPress={handleSave} 
                        />
                    </Animated.View>
                )}

                <View className="mt-5 pt-5 border-t border-gray-200 px-2">
                    <Text className="font-bold text-lg dark:text-white mb-4">Résumé du groupe</Text>
                    
                    {availabilities?.map((avail: Availability) => {
                        const isMe = avail.user._id === myId;
                        if (isMe && hasUnsavedChanges) return null;
                        
                        const displayRanges = isMe ? myRanges : avail.ranges;
                        if (displayRanges.length === 0) return null;

                        const setting = userSettings[avail.user._id];
                        const userColor = setting ? setting.color : '#ef4444';

                        return (
                            <View key={avail.user._id} className="mb-4">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: userColor }} />
                                    <Text className="font-bold dark:text-white">{getUserName(avail.user._id)}</Text>
                                </View>
                                <View className="pl-6 gap-1">
                                    {displayRanges.map((range: AvailabilityRange, idx: number) => (
                                        <Text key={idx} className="text-gray-600 dark:text-gray-300 capitalize">
                                            • {formatRange(dayjs(range.startDate), dayjs(range.endDate))}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        );
                    })}

                    {hasUnsavedChanges && myRanges.length > 0 && (
                        <View className="mb-4">
                            <View className="flex-row items-center gap-2 mb-2">
                                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: userSettings[myId]?.color || '#ef4444' }} />
                                <Text className="font-bold dark:text-white">Moi (En cours...)</Text>
                            </View>
                            <View className="pl-6 gap-1">
                                {myRanges.map((range: AvailabilityRange, idx: number) => (
                                    <Text key={idx} className="text-gray-600 dark:text-gray-300 capitalize">
                                        • {formatRange(dayjs(range.startDate), dayjs(range.endDate))}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
                
                {hasVoted && (
                    <Animated.View entering={FadeIn} className="mt-6 pt-5 border-t border-gray-200">
                        <Pressable 
                            onPress={handleNudge}
                            className="w-full flex-row justify-center items-center bg-orange-100 py-3 rounded-xl border border-orange-300 active:bg-orange-200"
                        >
                            <IconSymbol name="bell.fill" color="#ea580c" size={20} />
                            <Text className="ml-2 font-bold text-orange-600 text-lg">Relancer le groupe</Text>
                        </Pressable>
                    </Animated.View>
                )}
            </View>
        </ScrollView>
    );
}