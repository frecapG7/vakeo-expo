import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, { FadeIn } from "react-native-reanimated";

const PARTICIPANT_COLORS = ['#3b82f6', '#ef4444', '#eab308', '#a855f7', '#14b8a6', '#f97316', '#ec4899'];

// ==========================================
// 🚀 LE "MOCK" (FAUX SERVEUR) DEMANDÉ PAR ETHAN
// ==========================================
// Cette variable sert de base de données temporaire.
let MOCK_DATABASE: Record<string, string[]> = {};

const useMockVotes = (tripId: string) => {
    const queryClient = useQueryClient();

    // Fausse requête GET : Récupère les dispos de tout le monde
    const getVotes = useQuery({
        queryKey: ["mockVotes", tripId],
        queryFn: async () => {
            // On simule le temps de réponse d'un serveur (0.5s)
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_DATABASE;
        }
    });

    // Fausse requête PUT : Sauvegarde les dispos d'un utilisateur
    const putVote = useMutation({
        mutationFn: async ({ userId, dates }: { userId: string, dates: string[] }) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            MOCK_DATABASE[userId] = dates; // On sauvegarde dans la fausse BDD
            return true;
        },
        onSuccess: () => {
            // Rafraîchit l'interface instantanément
            queryClient.invalidateQueries({ queryKey: ["mockVotes", tripId] });
        }
    });

    return { getVotes, putVote };
};
// ==========================================


export default function VotesPage() {
    const { id } = useLocalSearchParams(); // id du voyage
    const colors = useColors();
    const { me, trip } = useContext(TripContext);

    const { getVotes, putVote } = useMockVotes(id as string);

    // État local pour gérer tes clics avant de sauvegarder
    const [mySelectedDates, setMySelectedDates] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    // On pré-remplit tes dates si tu as déjà voté
    useEffect(() => {
        if (getVotes.data && me?._id && getVotes.data[me._id]) {
            setMySelectedDates(getVotes.data[me._id]);
        }
    }, [getVotes.data, me?._id]);

    const participantsData = useMemo(() => {
        if (!trip?.users) return [];
        return trip.users.map((user, index) => ({
            _id: user._id,
            name: user.name || user.username,
            colorHex: PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length]
        }));
    }, [trip?.users]);

    // 🧠 LA FAMEUSE "RÉCONCILIATION" FRONT-END
    const viewMarkedDates = useMemo(() => {
        const marks: Record<string, any> = {};
        const allVotes = getVotes.data || {};

        // On parcourt les votes de chaque utilisateur
        Object.entries(allVotes).forEach(([userId, dates]) => {
            const pColor = participantsData.find(p => p._id === userId)?.colorHex || '#3b82f6';
            
            dates.forEach((dateStr) => {
                if (!marks[dateStr]) marks[dateStr] = { periods: [] };
                
                // On ajoute une ligne de couleur pour cet utilisateur à cette date
                marks[dateStr].periods.push({
                    startingDay: true, // Simplification : on fait des blocs indépendants
                    endingDay: true,
                    color: pColor
                });
            });
        });

        // Si tu es en train de modifier, on rajoute TES sélections locales en surbrillance
        if (isEditing) {
            mySelectedDates.forEach(dateStr => {
                if (!marks[dateStr]) marks[dateStr] = { periods: [] };
                
                const myColor = participantsData.find(p => p._id === me?._id)?.colorHex || '#3b82f6';
                
                // On vérifie si tu n'es pas déjà dans la liste pour éviter les doublons
                const alreadyHasMe = marks[dateStr].periods.some((p: any) => p.color === myColor);
                if (!alreadyHasMe) {
                    marks[dateStr].periods.push({ startingDay: true, endingDay: true, color: myColor });
                }
            });
        }

        return marks;
    }, [getVotes.data, participantsData, isEditing, mySelectedDates, me?._id]);

    const handleDayPress = (dateString: string) => {
        if (!isEditing) setIsEditing(true);

        setMySelectedDates(prev => {
            // Si la date est déjà sélectionnée, on l'enlève (toggle)
            if (prev.includes(dateString)) {
                return prev.filter(d => d !== dateString);
            }
            // Sinon on l'ajoute
            return [...prev, dateString];
        });
    };

    const handleSaveDates = async () => {
        if (!me?._id) return;
        await putVote.mutateAsync({ userId: me._id, dates: mySelectedDates });
        setIsEditing(false);
    };

    return (
        <ScrollView style={styles.container}>
            <View className="m-2 mt-5 mb-10 rounded-xl p-2 border border-gray-200">
                <View className="mb-5 px-2">
                    <Text className="text-xl font-bold dark:text-white">Disponibilités du groupe</Text>
                    <Text className="text-gray-600 dark:text-gray-300">Touchez les dates pour indiquer vos jours disponibles.</Text>
                </View>

                {/* LE CALENDRIER GÉANT */}
                <View className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                    <Calendar
                        markingType="multi-period"
                        markedDates={viewMarkedDates}
                        onDayPress={({ dateString }) => handleDayPress(dateString)}
                        theme={{
                            backgroundColor: colors.background,
                            calendarBackground: colors.card,
                            textSectionTitleColor: colors.text,
                            dayTextColor: colors.text,
                            monthTextColor: colors.text,
                            textDayFontSize: 16,
                            textMonthFontSize: 20,
                            'stylesheet.calendar.main': {
                                week: {
                                    marginTop: 0,
                                    marginBottom: 0,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    height: 90, // Le calendrier prend tout l'écran
                                },
                                dayContainer: {
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    borderRightWidth: 0.5,
                                    borderBottomWidth: 0.5,
                                    borderColor: '#e5e7eb',
                                }
                            },
                            'stylesheet.day.multiPeriod': {
                                base: {
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    paddingTop: 5,
                                },
                                text: {
                                    fontSize: 14,
                                    color: colors.text,
                                    marginBottom: 2,
                                    fontWeight: 'bold',
                                }
                            }
                        }}
                    />
                </View>

                {/* BOUTON DE SAUVEGARDE (Apparaît seulement si on modifie) */}
                {isEditing && (
                    <Animated.View entering={FadeIn} className="mt-5">
                        <Button 
                            variant="contained" 
                            title="Sauvegarder mes disponibilités" 
                            isLoading={putVote.isPending}
                            onPress={handleSaveDates} 
                        />
                    </Animated.View>
                )}

                {/* LÉGENDE DES COULEURS */}
                <View className="mt-5 px-2 flex-row flex-wrap gap-3">
                    {participantsData.map(p => (
                        <View key={p._id} className="flex-row items-center gap-2">
                            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: p.colorHex }} />
                            <Text className="dark:text-white">{p.name}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}