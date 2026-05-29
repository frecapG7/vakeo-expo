import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
// L'import correspond EXACTEMENT au nom du fichier de l'Étape 1
import { useGetAvailability, useUpdateAvailability, AvailabilityRange, Availability } from "@/hooks/api/useAvailability";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const SLOT_COLORS = ['#ef4444', '#3b82f6', '#a855f7', '#14b8a6', '#f97316', '#eab308', '#ec4899'];

export default function PollDetailsPage() {
    const { id } = useLocalSearchParams();
    const colors = useColors();
    const { formatRange } = useI18nTime();
    const { me, trip } = useContext(TripContext);
    
    // NOUVEAUX HOOKS (Fini l'erreur ligne 26 !)
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

    const userColors = useMemo(() => {
        const map: Record<string, string> = {};
        let index = 0;

        if (availabilities) {
            availabilities.forEach((avail: Availability) => {
                if (avail.user._id && !map[avail.user._id]) {
                    map[avail.user._id] = SLOT_COLORS[index % SLOT_COLORS.length];
                    index++;
                }
            });
        }
        if (!map[myId]) {
            map[myId] = SLOT_COLORS[index % SLOT_COLORS.length];
        }
        return map;
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

    const viewMarkedDates = useMemo(() => {
        const marks: Record<string, any> = {};

        const addRangeToMarks = (range: AvailabilityRange, userId: string) => {
            let current = dayjs(range.startDate);
            const end = dayjs(range.endDate);
            const color = userColors[userId];

            while (current.isBefore(end) || current.isSame(end, 'day')) {
                const dateStr = current.format('YYYY-MM-DD');
                if (!marks[dateStr]) marks[dateStr] = { periods: [] };

                marks[dateStr].periods.push({
                    startingDay: current.isSame(dayjs(range.startDate), 'day'),
                    endingDay: current.isSame(end, 'day'),
                    color: color
                });

                current = current.add(1, 'day');
            }
        };

        availabilities?.forEach((avail: Availability) => {
            if (avail.user._id === myId) return; 
            avail.ranges.forEach(range => addRangeToMarks(range, avail.user._id));
        });

        myRanges.forEach(range => addRangeToMarks(range, myId));

        if (tempStart) {
            if (!marks[tempStart]) marks[tempStart] = { periods: [] };
            marks[tempStart].periods.push({ color: userColors[myId], startingDay: true, endingDay: true });
        }

        return marks;
    }, [availabilities, myRanges, tempStart, myId, userColors]);

    const handleDayPress = (day: any) => {
        const dateString = day.dateString;
        const clickedDate = dayjs(dateString);

        if (!tempStart) {
            const isAlreadySelected = myRanges.some(range => {
                const rStart = dayjs(range.startDate);
                const rEnd = dayjs(range.endDate);
                return (clickedDate.isSame(rStart, 'day') || clickedDate.isAfter(rStart, 'day')) &&
                       (clickedDate.isSame(rEnd, 'day') || clickedDate.isBefore(rEnd, 'day'));
            });

            if (isAlreadySelected) {
                Alert.alert("Date déjà sélectionnée");
                return;
            }
            
            setHasUnsavedChanges(true);
            setTempStart(dateString);
        } else {
            const startStr = dayjs(tempStart).isBefore(clickedDate) ? tempStart : dateString;
            const endStr = dayjs(tempStart).isBefore(clickedDate) ? dateString : tempStart;
            
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

                <View className="rounded-xl overflow-hidden border border-gray-200 bg-white mb-5">
                    <Calendar
                        markingType={'multi-period'}
                        markedDates={viewMarkedDates}
                        onDayPress={handleDayPress}
                        theme={{
                            backgroundColor: colors.background,
                            calendarBackground: colors.card,
                            textSectionTitleColor: colors.text,
                            dayTextColor: colors.text,
                            monthTextColor: colors.text,
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

                        return (
                            <View key={avail.user._id} className="mb-4">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: userColors[avail.user._id] }} />
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
                                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: userColors[myId] }} />
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