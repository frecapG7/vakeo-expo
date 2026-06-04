import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { HousingOptions } from "@/components/polls/HousingOptions";
import { PollOption } from "@/components/polls/PollOption";
import SharedCalendarPoll from "@/components/polls/SharedCalendarPoll";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetPoll, useUnvotePoll, useVotePoll } from "@/hooks/api/usePolls";
import useI18nNumbers from "@/hooks/i18n/useI18nNumbers";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { getDatesBetween } from "@/lib/utils"; // <-- Assure-toi que cet import existe
import { useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Text, View, Pressable, Modal, SafeAreaView } from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const PARTICIPANT_COLORS = ['#3b82f6', '#ef4444', '#eab308', '#a855f7', '#14b8a6', '#f97316', '#ec4899'];

export default function PollDetailsPage() {
    const { id, pollId } = useLocalSearchParams();
    const colors = useColors();

    const { me, trip } = useContext(TripContext); 
    const { data: poll } = useGetPoll(id, pollId);

    const votePoll = useVotePoll(id, pollId);
    const unvotePoll = useUnvotePoll(id, pollId);

    const { formatDuration, formatRange } = useI18nTime();
    const { formatPercent } = useI18nNumbers();

    const [selectedOption, setSelectedOption] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(dayjs()); 
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

    // États pour l'ajout MANUEL de nouvelles dates
    const [openAddModal, setOpenAddModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleClick = async (option: any, includeMe: boolean) => {
        if (includeMe)
            unvotePoll.mutateAsync({ option: option?._id, user: me })
        else
            await votePoll.mutateAsync({ options: [option?._id], user: me });
    }

    const participantsData = useMemo(() => {
        if (!trip?.users) return [];
        return trip.users.map((user: any, index: number) => ({
            _id: user._id,
            name: user.name || user.username,
            colorHex: PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length]
        }));
    }, [trip?.users]);

    // Remplissage du calendrier avec toutes les dates (étirement des créneaux)
    const calendarVotesData = useMemo(() => {
        if (!poll || poll.type !== "DatesPoll") return {};
        const formattedVotes: Record<string, string[]> = {};
        
        poll.options?.forEach((opt: any) => {
            if (!opt.startDate) return;
            const start = dayjs(opt.startDate).startOf('day');
            const end = opt.endDate ? dayjs(opt.endDate).startOf('day') : start;
            const voterIds = opt.selectedBy?.map((u: any) => u._id) || [];
            
            let current = start;
            while (current.isBefore(end) || current.isSame(end, 'day')) {
                const dateStr = current.format('YYYY-MM-DD');
                if (formattedVotes[dateStr]) {
                     formattedVotes[dateStr] = [...new Set([...formattedVotes[dateStr], ...voterIds])];
                } else {
                     formattedVotes[dateStr] = [...voterIds];
                }
                current = current.add(1, 'day');
            }
        });
        return formattedVotes;
    }, [poll]);

    // LA MAGIE DU CLIC SUR LE CALENDRIER : Voter OU Ajouter
    const handleCalendarToggle = (dateString: string) => {
        if (!poll?.options) return;
        const clickedDate = dayjs(dateString);

        const overlappingOptions = poll.options.filter((opt: any) => {
            if (!opt.startDate) return false;
            const start = dayjs(opt.startDate).startOf('day');
            const end = opt.endDate ? dayjs(opt.endDate).startOf('day') : start;
            return (clickedDate.isSame(start, 'day') || clickedDate.isAfter(start, 'day')) &&
                   (clickedDate.isSame(end, 'day') || clickedDate.isBefore(end, 'day'));
        });

        if (overlappingOptions.length > 0) {
            // Le créneau existe : On VOTE
            overlappingOptions.forEach(targetOption => {
                const includeMe = targetOption.selectedBy?.map((u: any) => u._id).includes(me?._id);
                handleClick(targetOption, includeMe);
            });
        } else {
            // Le créneau n'existe pas : On l'AJOUTE à la main
            setStartDate(dateString);
            setEndDate(dateString);
            setOpenAddModal(true);
        }
    };

    // ⚠️ FONCTION POUR LE DEVELOPPEUR ⚠️
    const handleAddNewOption = async () => {
        // ICI : Il faut appeler l'API pour rajouter la nouvelle option au sondage
        // ex: await createPollOption.mutateAsync({ startDate, endDate, pollId });
        alert(`DEV: Relier API pour créer l'option du ${startDate} au ${endDate}`);
        
        setOpenAddModal(false);
        setStartDate("");
        setEndDate("");
    };

    if (!poll) return (
        <View style={styles.container}>
            <View className="flex-row gap-2 items-center"><Skeleton variant="circular" /><View className="w-40"><Skeleton height={5} /></View></View>
            <View className="gap-5 my-5"><Skeleton height={40} /><Skeleton height={40} /><Skeleton height={40} /></View>
        </View>
    );

    return (
        <Animated.ScrollView style={styles.container}>
            <View className="flex-row gap-2 items-center my-2">
                <Avatar src={poll?.createdBy?.avatar} alt={poll?.createdBy?.name?.charAt(0)} size2="md" />
                <View>
                    <Text className="font-bold text-lg dark:text-white">{poll?.createdBy?.name}</Text>
                    <Text className="dark:text-white">{formatDuration(poll?.createdAt)}</Text>
                </View>
            </View>

            <View className="m-2 mb-10 rounded-xl p-2 border border-gray-200">
                <View className="mb-5">
                    <Text className="text-xl font-bold dark:text-white">{poll?.question}</Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-lg">{poll?.hasSelected.length} votes</Text>
                </View>

                {poll?.type === "DatesPoll" && (
                    <View className="mb-5">
                        <View className="flex-row p-1 mb-4 rounded-lg" style={{ backgroundColor: colors.neutral }}>
                            <Pressable onPress={() => setViewMode('calendar')} className="flex-1 py-2 items-center rounded-md" style={{ backgroundColor: viewMode === 'calendar' ? colors.card : 'transparent' }}>
                                <Text className="font-bold text-sm" style={{ color: viewMode === 'calendar' ? colors.primary : colors.text }}>Calendrier</Text>
                            </Pressable>
                            <Pressable onPress={() => setViewMode('list')} className="flex-1 py-2 items-center rounded-md" style={{ backgroundColor: viewMode === 'list' ? colors.card : 'transparent' }}>
                                <Text className="font-bold text-sm" style={{ color: viewMode === 'list' ? colors.primary : colors.text }}>Liste</Text>
                            </Pressable>
                        </View>

                        {viewMode === 'calendar' ? (
                            <SharedCalendarPoll 
                                baseDate={currentMonth} 
                                participants={participantsData} 
                                votes={calendarVotesData} 
                                currentUserId={me?._id} 
                                onToggleDate={handleCalendarToggle} 
                                onPreviousMonth={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
                                onNextMonth={() => setCurrentMonth(currentMonth.add(1, 'month'))}
                            />
                        ) : (
                            <View className="gap-5">
                                {/* BOUTON POUR AJOUTER A LA MAIN DANS LA LISTE */}
                                <Pressable
                                    onPress={() => { setStartDate(""); setEndDate(""); setOpenAddModal(true); }}
                                    className="my-1 flex-row items-center justify-center rounded-full bg-blue-200 p-3"
                                >
                                    <IconSymbol name="plus" color="black" />
                                    <Text className="font-bold ml-2">Ajouter mes dates</Text>
                                </Pressable>

                                {poll?.options?.map((option: any) => {
                                    const includeMe = option?.selectedBy?.map((u: any) => u._id).includes(me?._id);
                                    return (
                                        <Button disabled={poll?.isClosed || votePoll?.isPending} key={option?._id} onPress={() => handleClick(option, includeMe)} onLongPress={() => setSelectedOption(option)}>
                                            <PollOption label={formatRange(dayjs(option.startDate), dayjs(option.endDate))} selectedBy={option.selectedBy} percent={option.percent} isAnonymous={poll.isAnonymous} includeUser={includeMe} />
                                        </Button>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                )}

                {/* MODALE POUR RENTRER LES DATES A LA MAIN */}
                <Modal visible={openAddModal} animationType="slide" transparent={false} onRequestClose={() => setOpenAddModal(false)}>
                    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: colors.background }}>
                        <Pressable onPress={() => setOpenAddModal(false)} className="mb-5">
                            <Text className="dark:text-white text-xl">Fermer</Text>
                        </Pressable>
                        <Text className="text-lg font-bold mb-3 dark:text-white">Ajouter une nouvelle disponibilité</Text>
                        <Calendar
                            theme={{ backgroundColor: colors.background, calendarBackground: colors.background, dayTextColor: colors.text, monthTextColor: colors.text }}
                            markingType="period"
                            onDayPress={({ dateString }) => {
                                if (!startDate || (startDate && endDate)) {
                                    setStartDate(dateString);
                                    setEndDate("");
                                } else {
                                    setEndDate(dateString);
                                }
                            }}
                            markedDates={{
                                ...(startDate && { [startDate]: { startingDay: true, color: colors.primary, textColor: colors.card, selected: true } }),
                                ...(endDate && { [endDate]: { endingDay: true, color: colors.primary, textColor: colors.card, selected: true } }),
                                ...(startDate && endDate && getDatesBetween ? getDatesBetween(dayjs(startDate), dayjs(endDate)).reduce((acc: any, date) => {
                                    acc[date] = { color: colors.neutral, textColor: colors.text, selected: true };
                                    return acc;
                                }, {}) : {})
                            }}
                        />
                        {(startDate) && (
                            <Animated.View entering={FadeIn} exiting={FadeOut} className="mx-2 my-5">
                                <Button variant="contained" title="Valider ces dates" onPress={handleAddNewOption} />
                            </Animated.View>
                        )}
                    </SafeAreaView>
                </Modal>

            </View>
            <PickUsersModal open={!!selectedOption && !poll.isAnonymous} onClose={() => setSelectedOption(null)} users={selectedOption?.selectedBy} disabled title="Votants" />
        </Animated.ScrollView>
    )
}