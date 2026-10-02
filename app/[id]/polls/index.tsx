import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { HousingOptions } from "@/components/polls/HousingOptions";
import { PollOption } from "@/components/polls/PollOption";
import SharedCalendar from "@/components/polls/SharedCalendar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { useTrip } from "@/context/TripContext";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useGetDashboard } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { translateType } from "@/lib/pollUtils";
import dayjs from "@/lib/dayjs-config";

import { PollOption as Option } from "@/types/models";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState, useMemo } from "react";
import { Text, View, Modal, TouchableOpacity, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ==========================================
// MODAL CALENDRIER (POUR LA VUE LISTE)
// ==========================================
const DateRangePickerModal = ({ visible, onClose, onValidate }: any) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [startDay, setStartDay] = useState<any>(null);
    const [endDay, setEndDay] = useState<any>(null);

    const calendarDays = useMemo(() => {
        const startOfMonth = currentMonth.startOf('month');
        const startOfGrid = startOfMonth.startOf('isoWeek');
        const endOfGrid = startOfGrid.add(41, 'day');
        const days = [];
        let day = startOfGrid;
        while (day.isBefore(endOfGrid) || day.isSame(endOfGrid, 'day')) {
            days.push(day);
            day = day.add(1, 'day');
        }
        return days;
    }, [currentMonth]);

    const handleDayClick = (day: any) => {
        if (!startDay || (startDay && endDay)) {
            setStartDay(day);
            setEndDay(null);
        } else if (startDay && !endDay) {
            if (day.isBefore(startDay, 'day')) {
                setEndDay(startDay);
                setStartDay(day);
            } else {
                setEndDay(day);
            }
        }
    };
    const { trip, me } = useTrip();

    const handleValidate = () => {
        if (startDay) {
            onValidate(startDay, endDay || startDay);
            setStartDay(null);
            setEndDay(null);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white dark:bg-gray-900 rounded-t-3xl p-4 pb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold dark:text-white">Sélectionner une période</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <IconSymbol name="xmark" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center justify-between mb-4">
                        <TouchableOpacity onPress={() => setCurrentMonth(prev => prev.subtract(1, 'month'))} className="p-2">
                            <IconSymbol name="chevron.left" size={20} color="gray" />
                        </TouchableOpacity>
                        <Text className="text-lg font-semibold dark:text-white capitalize">{currentMonth.format("MMMM YYYY")}</Text>
                        <TouchableOpacity onPress={() => setCurrentMonth(prev => prev.add(1, 'month'))} className="p-2">
                            <IconSymbol name="chevron.right" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row border-b border-gray-200 dark:border-gray-800 pb-2 mb-2">
                        {["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"].map((d, i) => (
                            <Text key={i} className="flex-1 text-center text-gray-400 font-bold text-xs">{d}</Text>
                        ))}
                    </View>

                    <View className="flex-row flex-wrap">
                        {calendarDays.map((day, i) => {
                            const isCurrentMonth = day.isSame(currentMonth, 'month');
                            const isStart = startDay && day.isSame(startDay, 'day');
                            const isEnd = endDay && day.isSame(endDay, 'day');
                            const isInRange = startDay && endDay && day.isAfter(startDay, 'day') && day.isBefore(endDay, 'day');

                            return (
                                <TouchableOpacity key={i} onPress={() => handleDayClick(day)} className={`w-[14.28%] aspect-square justify-center items-center p-1`}>
                                    <View className={`w-full h-full justify-center items-center rounded-lg ${isStart || isEnd ? 'bg-orange-500' : ''} ${isInRange ? 'bg-orange-200 dark:bg-orange-900/50' : ''}`}>
                                        <Text className={`font-semibold ${isStart || isEnd ? 'text-white' : (isCurrentMonth ? 'text-gray-800 dark:text-white' : 'text-gray-300 dark:text-gray-700')}`}>
                                            {day.format("D")}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <Button title="Valider la sélection" variant="contained" onPress={handleValidate} disabled={!startDay} className="mt-6" />
                </View>
            </View>
        </Modal>
    );
};


// ==========================================
// PAGE PRINCIPALE
// ==========================================
export default function PollDetailsPage() {
    const { id, pollId } = useLocalSearchParams<{ id: string, pollId: string }>();

    const { me } = useContext(TripContext);
    
    const { data: poll } = useGetPoll(id, pollId);
    const votePoll = useVotePoll(id, pollId, me?._id);
    const unvotePoll = useUnvotePoll(id, pollId, me?._id);
    const router = useRouter();

    const { formatDuration, formatRange } = useI18nTime();

    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [loadingOptionId, setLoadingOptionId] = useState<string | null>(null);
    
    // CORRECTION : View state 100% local (par défaut sur calendrier)
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
    const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);

    const insets = useSafeAreaInsets();

    const handleClick = async (option: Option, includeMe: boolean) => {
        setLoadingOptionId(option._id);
        try {
            if (includeMe)
                await unvotePoll.mutateAsync({ option: option._id })
            else
                await votePoll.mutateAsync({ options: [option._id] });
        } finally {
            setLoadingOptionId(null);
        }
    }

    const handleToggleDay = async (dayJsObj: any) => {
        console.log("Clic sur la date :", dayJsObj.format('YYYY-MM-DD'));
    };

    const handleAddOptionRange = async (start: any, end: any) => {
        console.log("Plage ajoutée :", start.format('YYYY-MM-DD'), "au", end.format('YYYY-MM-DD'));
        setIsRangePickerOpen(false);
    };

    // CORRECTION : Logique de groupement préservant l'anonymat
    const groupedOptions = useMemo(() => {
        if (poll?.type !== "DatesPoll" || !poll?.options) return [];
        
        const groups: any[] = [];
        let currentGroup: any = null;

        const sortedOptions = [...poll.options].sort((a: any, b: any) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf());

        sortedOptions.forEach((opt: any) => {
            if (!currentGroup) {
                currentGroup = { ...opt, optionIds: [opt._id] };
            } else {
                const isConsecutive = dayjs(currentGroup.endDate).add(1, 'day').isSame(dayjs(opt.startDate), 'day');
                
                // Si c'est anonyme on groupe par pourcentage identique, sinon on groupe par les mêmes votants exacts
                const isSameVotes = poll.isAnonymous 
                    ? (currentGroup.percent === opt.percent)
                    : (currentGroup.selectedBy || []).map((u:any)=>u._id).sort().join(',') === (opt.selectedBy || []).map((u:any)=>u._id).sort().join(',');
                
                if (isConsecutive && isSameVotes) {
                    currentGroup.endDate = opt.endDate;
                    currentGroup.optionIds.push(opt._id);
                } else {
                    groups.push(currentGroup);
                    currentGroup = { ...opt, optionIds: [opt._id] };
                }
            }
        });
        if (currentGroup) groups.push(currentGroup);
        return groups;
    }, [poll?.options, poll?.type, poll?.isAnonymous]);


    if (!poll)
        return (
            <View style={styles.container}>
                <View className="flex-row gap-3 items-center p-4">
                    <Skeleton variant="circular" size="md" />
                    <View className="flex-1 gap-2">
                        <Skeleton height={8} width="60%" />
                        <Skeleton height={6} width="40%" />
                    </View>
                </View>
                <View className="gap-4 my-4 px-4">
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                </View>
            </View>
        );

    return (
        <Animated.ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom }} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ headerRight: () => null, title: "Détail du sondage" }} />

            <View className={`m-2 mb-4 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 ${poll.type === 'DatesPoll' && viewMode === 'calendar' ? 'pb-0 overflow-hidden' : 'p-4'}`}>
                
                <View className={`${poll.type === 'DatesPoll' && viewMode === 'calendar' ? 'p-4 pb-0' : ''}`}>
                    <View className="flex-row items-center gap-2 mb-4">
                        <Avatar src={poll.createdBy?.avatar} alt={poll.createdBy?.name?.charAt(0)} size2="sm" />
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">{poll.createdBy?.name}</Text>
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-2xl font-bold dark:text-white mb-2">{poll.question}</Text>
                        
                        {poll.type === "DatesPoll" && (
                            <View className="flex-row bg-gray-100 dark:bg-gray-900 p-1 rounded-xl mt-2">
                                <Pressable onPress={() => setViewMode('calendar')} className={`flex-1 flex-row items-center justify-center py-2 rounded-lg ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}>
                                    <IconSymbol name="calendar" size={16} color={viewMode === 'calendar' ? '#f97316' : 'gray'} />
                                    <Text className={`ml-2 font-semibold ${viewMode === 'calendar' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Calendrier</Text>
                                </Pressable>
                                <Pressable onPress={() => setViewMode('list')} className={`flex-1 flex-row items-center justify-center py-2 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}>
                                    <IconSymbol name="list.bullet" size={16} color={viewMode === 'list' ? '#f97316' : 'gray'} />
                                    <Text className={`ml-2 font-semibold ${viewMode === 'list' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Liste</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>

                {poll.type === "DatesPoll" && viewMode === 'calendar' && (
                    <SharedCalendar poll={poll} me={me} onToggleDay={handleToggleDay} />
                )}

                {poll.type === "DatesPoll" && viewMode === 'list' && (
                    <View className="gap-4 mb-4">
                        {groupedOptions.map((group: any) => {
                            const includeMe = group.selectedBy?.some((u: any) => u._id === me?._id);
                            const start = dayjs(group.startDate);
                            const end = dayjs(group.endDate);
                            const label = start.isSame(end, 'day') 
                                ? start.format("DD MMM YYYY") 
                                : `${start.format("DD")} au ${end.format("DD MMM YYYY")}`;

                            return (
                                <Button
                                    key={group.optionIds.join('-')}
                                    onPress={() => handleClick(group, includeMe)}
                                    onLongPress={() => setSelectedOption(group)}
                                    className={`rounded-xl border-2 ${includeMe ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'}`}
                                >
                                    <PollOption
                                        label={label}
                                        selectedBy={group.selectedBy || []}
                                        percent={group.percent ?? 0}
                                        isAnonymous={poll.isAnonymous}
                                        includeUser={includeMe}
                                        isLoading={loadingOptionId === group._id}
                                    />
                                </Button>
                            );
                        })}
                        
                        <View className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <Button 
                                variant="contained" size="small" icon="plus" 
                                title="Ajouter une proposition" 
                                onPress={() => setIsRangePickerOpen(true)} 
                            />
                        </View>
                    </View>
                )}

                {poll.type === "HousingPoll" && (
                    <HousingOptions poll={poll} />
                )}

                {poll.type !== "DatesPoll" && poll.type !== "HousingPoll" && (
                    <View className="gap-4 mb-4">
                        {poll.options?.map((opt: Option) => {
                            const includeMe = opt.selectedBy?.some((u: any) => u._id === me?._id);
                            return (
                                <Button 
                                    key={opt._id} 
                                    onPress={() => handleClick(opt, includeMe)} 
                                    onLongPress={() => setSelectedOption(opt)} 
                                    className={`rounded-xl border-2 ${includeMe ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'}`}
                                >
                                    <PollOption 
                                        label={opt.label || ''} 
                                        selectedBy={opt.selectedBy || []} 
                                        percent={opt.percent ?? 0} 
                                        isAnonymous={poll.isAnonymous} 
                                        includeUser={includeMe} 
                                        isLoading={loadingOptionId === opt._id} 
                                    />
                                </Button>
                            );
                        })}
                    </View>
                )}

            </View>

            <PickUsersModal open={!!selectedOption && !poll.isAnonymous} onClose={() => setSelectedOption(null)} users={selectedOption?.selectedBy || []} disabled title="Votants" />
            <DateRangePickerModal visible={isRangePickerOpen} onClose={() => setIsRangePickerOpen(false)} onValidate={handleAddOptionRange} />
        </Animated.ScrollView>
    );
}