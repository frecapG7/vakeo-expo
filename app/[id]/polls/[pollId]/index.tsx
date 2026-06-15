import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useAvailability, AvailabilityRange } from "@/hooks/api/useAvailability";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const PARTICIPANT_COLORS = ['#3b82f6', '#ef4444', '#eab308', '#a855f7', '#14b8a6', '#f97316', '#ec4899'];

export default function PollDetailsPage() {
    const { id } = useLocalSearchParams();
    const colors = useColors();
    const { formatRange } = useI18nTime();
    
    const { me, trip } = useContext(TripContext);
    
    const { getAvailabilities, updateAvailability } = useAvailability(String(id));

    const [tempStart, setTempStart] = useState<string | null>(null);
    const [myRanges, setMyRanges] = useState<AvailabilityRange[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [lastNudgedAt, setLastNudgedAt] = useState<number | null>(null);

    useEffect(() => {
        if (getAvailabilities.data && me?._id) {
            const myData = getAvailabilities.data.find((a: any) => a.userId === me._id);
            if (myData && !hasUnsavedChanges) {
                setMyRanges(myData.ranges);
            }
        }
    }, [getAvailabilities.data, me?._id]);

    const participantsData = useMemo(() => {
        if (!trip?.users) return [];
        return trip.users.map((user, index) => ({
            _id: user._id,
            name: user.name || user.username,
            colorHex: PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length]
        }));
    }, [trip?.users]);

    const getUserColor = (userId?: string) => {
        return participantsData.find(p => p._id === userId)?.colorHex || '#9ca3af';
    };

    const getUserName = (userId?: string) => {
        return participantsData.find(p => p._id === userId)?.name || 'Utilisateur inconnu';
    };

    const hasVoted = useMemo(() => {
        if (!me?._id || !getAvailabilities.data) return false;
        const myData = getAvailabilities.data.find((a: any) => a.userId === me._id);
        return myData && myData.ranges && myData.ranges.length > 0;
    }, [getAvailabilities.data, me?._id]);

    // 🧠 LOGIQUE DE DESSIN (Avec sécurité anti-doublons de lignes)
    const viewMarkedDates = useMemo(() => {
        const marks: Record<string, any> = {};
        let maxVotesCount = 0;

        const addRangeToMarks = (range: AvailabilityRange, userId: string, color: string) => {
            let current = dayjs(range.startDate);
            const end = dayjs(range.endDate);

            while (current.isBefore(end) || current.isSame(end, 'day')) {
                const dateStr = current.format('YYYY-MM-DD');
                if (!marks[dateStr]) marks[dateStr] = { periods: [], users: new Set() };

                // 🛡️ SÉCURITÉ : On ne dessine la ligne que si l'utilisateur n'est pas déjà enregistré ce jour-là
                if (!marks[dateStr].users.has(userId)) {
                    marks[dateStr].users.add(userId);
                    marks[dateStr].periods.push({
                        color: color,
                        startingDay: current.isSame(dayjs(range.startDate), 'day'),
                        endingDay: current.isSame(end, 'day')
                    });
                }

                current = current.add(1, 'day');
            }
        };

        // 1. Ajouter les données des autres
        getAvailabilities.data?.forEach((avail: any) => {
            if (avail.userId === me?._id) return; 
            const color = getUserColor(avail.userId);
            avail.ranges.forEach((range: any) => addRangeToMarks(range, avail.userId, color));
        });

        // 2. Ajouter mes données
        const myColor = getUserColor(me?._id);
        myRanges.forEach(range => addRangeToMarks(range, me?._id || 'me', myColor));

        // 3. Ajouter mon clic en cours
        if (tempStart) {
            if (!marks[tempStart]) marks[tempStart] = { periods: [], users: new Set() };
            if (!marks[tempStart].users.has(me?._id || 'me')) {
                marks[tempStart].users.add(me?._id || 'me');
                marks[tempStart].periods.push({ color: myColor, startingDay: true, endingDay: true });
            }
        }

        // 4. Calcul du nombre maximum de votes
        Object.keys(marks).forEach(dateStr => {
            const count = marks[dateStr].users.size;
            if (count > maxVotesCount) {
                maxVotesCount = count;
            }
        });

        // 5. Marqueur Top Choice
        Object.keys(marks).forEach(dateStr => {
            const count = marks[dateStr].users.size;
            marks[dateStr].isTopChoice = (count === maxVotesCount && maxVotesCount > 0);
        });

        return marks;
    }, [getAvailabilities.data, myRanges, tempStart, me?._id]);

    const handleDayPress = (dateString: string) => {
        const clickedDate = dayjs(dateString);

        if (!tempStart) {
            // 🛡️ SÉCURITÉ 1 : On vérifie si la date cliquée est déjà dans nos périodes
            const isAlreadySelected = myRanges.some(range => {
                const rStart = dayjs(range.startDate);
                const rEnd = dayjs(range.endDate);
                return (clickedDate.isSame(rStart, 'day') || clickedDate.isAfter(rStart, 'day')) &&
                       (clickedDate.isSame(rEnd, 'day') || clickedDate.isBefore(rEnd, 'day'));
            });

            if (isAlreadySelected) {
                Alert.alert("Date déjà sélectionnée", "Vous avez déjà indiqué être disponible à cette date. Supprimez la période correspondante en dessous si vous souhaitez la modifier.");
                return;
            }
            
            setHasUnsavedChanges(true);
            setTempStart(dateString);
        } else {
            const startStr = dayjs(tempStart).isBefore(clickedDate) ? tempStart : dateString;
            const endStr = dayjs(tempStart).isBefore(clickedDate) ? dateString : tempStart;
            
            const nStart = dayjs(startStr);
            const nEnd = dayjs(endStr);

            // 🛡️ SÉCURITÉ 2 : On vérifie si le nouvel intervalle chevauche un intervalle existant
            const isOverlapping = myRanges.some(range => {
                const rStart = dayjs(range.startDate);
                const rEnd = dayjs(range.endDate);
                // Il y a chevauchement si Start1 <= End2 ET Start2 <= End1
                return (nStart.isSame(rEnd, 'day') || nStart.isBefore(rEnd, 'day')) && 
                       (rStart.isSame(nEnd, 'day') || rStart.isBefore(nEnd, 'day'));
            });

            if (isOverlapping) {
                Alert.alert("Chevauchement", "Cette nouvelle période chevauche vos disponibilités existantes. Veuillez choisir une période libre.");
                setTempStart(null); // On annule la sélection en cours
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
        if (!me?._id) return;
        await updateAvailability.mutateAsync({
            userId: me._id,
            ranges: myRanges
        });
        setHasUnsavedChanges(false);
    };

    const handleNudge = () => {
        const now = Date.now();
        if (lastNudgedAt && (now - lastNudgedAt) < 86400000) {
            Alert.alert("Déjà relancés !", "Une notification a déjà été envoyée au groupe il y a moins de 24 heures. Laissez-leur un peu de temps !");
            return;
        }

        setLastNudgedAt(now);
        Alert.alert("Succès", "Une notification vient d'être envoyée à tous ceux qui n'ont pas encore donné leurs disponibilités.");
    };

    return (
        <ScrollView style={styles.container}>
            <View className="m-2 mt-5 mb-10 rounded-xl p-2 border border-gray-200">
                
                {/* EN-TÊTE */}
                <View className="mb-5 px-2">
                    <Text className="text-xl font-bold dark:text-white">Disponibilités partagées</Text>
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                        {tempStart ? "Touchez la date de fin de votre disponibilité." : "Touchez une date pour donner vos disponibilités."}
                    </Text>
                </View>

                {/* CALENDRIER */}
                <View className="rounded-xl overflow-hidden border border-gray-200 bg-white mb-5">
                    <Calendar
                        theme={{
                            backgroundColor: colors.background,
                            calendarBackground: colors.card,
                            textSectionTitleColor: colors.text,
                            dayTextColor: colors.text,
                            monthTextColor: colors.text,
                            'stylesheet.calendar.main': {
                                week: { marginTop: 0, marginBottom: 0, flexDirection: 'row', justifyContent: 'space-around', height: 70 },
                                dayContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' }
                            }
                        }}
                        dayComponent={({ date, state }) => {
                            const dateStr = date?.dateString || '';
                            const mark = viewMarkedDates[dateStr] || { periods: [], isTopChoice: false };
                            
                            return (
                                <Pressable 
                                    onPress={() => handleDayPress(dateStr)}
                                    style={{
                                        width: '95%',
                                        height: 65,
                                        backgroundColor: 'transparent',
                                        borderColor: mark.isTopChoice ? '#eab308' : 'transparent',
                                        borderWidth: mark.isTopChoice ? 2 : 0,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        paddingTop: 6,
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
                                    
                                    <View style={{ width: '100%', marginTop: 'auto', marginBottom: 4, gap: 1 }}>
                                        {mark.periods.map((p: any, i: number) => (
                                            <View key={i} style={{
                                                height: 4,
                                                backgroundColor: p.color,
                                                width: '100%',
                                                marginLeft: p.startingDay ? 4 : 0,
                                                marginRight: p.endingDay ? 4 : 0,
                                                borderTopLeftRadius: p.startingDay ? 4 : 0,
                                                borderBottomLeftRadius: p.startingDay ? 4 : 0,
                                                borderTopRightRadius: p.endingDay ? 4 : 0,
                                                borderBottomRightRadius: p.endingDay ? 4 : 0,
                                            }} />
                                        ))}
                                    </View>
                                </Pressable>
                            );
                        }}
                    />
                </View>

                {/* MES SÉLECTIONS */}
                {myRanges.length > 0 && (
                    <View className="mb-5 gap-2 px-2">
                        <Text className="font-bold dark:text-white mb-2">Mes périodes sélectionnées :</Text>
                        {myRanges.map((range, index) => (
                            <View key={index} className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-700">
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

                {/* BOUTON SAUVEGARDER */}
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

                {/* RÉSUMÉ DES DISPONIBILITÉS DU GROUPE */}
                <View className="mt-5 pt-5 border-t border-gray-200 px-2">
                    <Text className="font-bold text-lg dark:text-white mb-4">Résumé du groupe</Text>
                    {getAvailabilities.data?.map((avail: any) => {
                        const isMe = avail.userId === me?._id;
                        if (isMe && hasUnsavedChanges) return null;
                        
                        const displayRanges = isMe ? myRanges : avail.ranges;
                        if (displayRanges.length === 0) return null;

                        const userColor = getUserColor(avail.userId);
                        const userName = isMe ? "Moi" : getUserName(avail.userId);

                        return (
                            <View key={avail.userId} className="mb-4">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: userColor }} />
                                    <Text className="font-bold dark:text-white">{userName}</Text>
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
                    
                    {getAvailabilities.data?.length === 0 && myRanges.length === 0 && (
                        <Text className="text-gray-500 italic">Personne n'a encore partagé ses disponibilités.</Text>
                    )}
                </View>

                {/* BOUTON RELANCER */}
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