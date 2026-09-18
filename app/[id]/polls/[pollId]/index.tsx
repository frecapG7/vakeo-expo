import { PickUsersModal } from "@/components/modals/PickUsersModal";
import SharedCalendar from "@/components/polls/SharedCalendar";
import { PollOption } from "@/components/polls/PollOption";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import dayjs from "@/lib/dayjs-config";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View, Modal, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_ME = { _id: "u_me", name: "Moi", avatar: null };
const MOCK_USERS = [
    { _id: "u1", name: "Thomas", avatar: null },
    { _id: "u2", name: "Marie", avatar: null },
    { _id: "u3", name: "Lucas", avatar: null },
    { _id: "u4", name: "Sophie", avatar: null },
    { _id: "u5", name: "Hugo", avatar: null }
];

const INITIAL_POLL = {
    _id: "poll_123",
    type: "DatesPoll",
    question: "Quand partez-vous ?",
    defaultView: "calendar", // Défini par défaut à la création
    createdBy: MOCK_USERS[0],
    createdAt: dayjs().subtract(2, 'hour').toISOString(),
    isAnonymous: false,
    isClosed: false,
    hasSelected: ["u1", "u2", "u3", "u4", "u5"], 
    options: [
        { _id: "opt_1", startDate: "2024-07-10T00:00:00.000Z", endDate: "2024-07-10T23:59:59.000Z", selectedBy: [MOCK_USERS[0]] },
        { _id: "opt_2", startDate: "2024-07-11T00:00:00.000Z", endDate: "2024-07-11T23:59:59.000Z", selectedBy: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2], MOCK_USERS[3]] },
        { _id: "opt_3", startDate: "2024-07-12T00:00:00.000Z", endDate: "2024-07-12T23:59:59.000Z", selectedBy: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2], MOCK_USERS[3], MOCK_USERS[4]] },
    ]
};

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

export default function PollDetailsPage() {
    const insets = useSafeAreaInsets();
    const [poll, setPoll] = useState<any>(INITIAL_POLL);
    const me = MOCK_ME;

    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>(poll.defaultView || 'calendar');
    const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);

    const handleToggleDay = (dayJsObj: any) => {
        setPoll((prevPoll: any) => {
            const newOptions = [...prevPoll.options];
            const targetDateStr = dayJsObj.format('YYYY-MM-DD');
            const optIndex = newOptions.findIndex(opt => dayjs(opt.startDate).format('YYYY-MM-DD') === targetDateStr);

            if (optIndex !== -1) {
                const opt = newOptions[optIndex];
                const hasVoted = opt.selectedBy.some((u: any) => u._id === me._id);
                if (hasVoted) {
                    opt.selectedBy = opt.selectedBy.filter((u: any) => u._id !== me._id);
                    if (opt.selectedBy.length === 0) newOptions.splice(optIndex, 1);
                } else {
                    opt.selectedBy.push(me);
                }
            } else {
                newOptions.push({
                    _id: "opt_" + Math.random().toString(36).substr(2, 9),
                    startDate: dayJsObj.startOf('day').toISOString(),
                    endDate: dayJsObj.endOf('day').toISOString(),
                    selectedBy: [me]
                });
            }
            newOptions.sort((a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf());
            return { ...prevPoll, options: newOptions };
        });
    };

    const handleAddOptionRange = (start: any, end: any) => {
        setPoll((prevPoll: any) => {
            const newOptions = [...prevPoll.options];
            let currentDay = start.startOf('day');
            const lastDay = end.startOf('day');

            while (currentDay.isBefore(lastDay) || currentDay.isSame(lastDay, 'day')) {
                const targetDateStr = currentDay.format('YYYY-MM-DD');
                const optIndex = newOptions.findIndex(opt => dayjs(opt.startDate).format('YYYY-MM-DD') === targetDateStr);

                if (optIndex !== -1) {
                    const hasVoted = newOptions[optIndex].selectedBy.some((u: any) => u._id === me._id);
                    if (!hasVoted) newOptions[optIndex].selectedBy.push(me);
                } else {
                    newOptions.push({
                        _id: "opt_" + Math.random().toString(36).substr(2, 9),
                        startDate: currentDay.startOf('day').toISOString(),
                        endDate: currentDay.endOf('day').toISOString(),
                        selectedBy: [me]
                    });
                }
                currentDay = currentDay.add(1, 'day');
            }

            newOptions.sort((a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf());
            return { ...prevPoll, options: newOptions };
        });
        setIsRangePickerOpen(false);
    };

    const groupedOptions = useMemo(() => {
        const groups: any[] = [];
        let currentGroup: any = null;

        poll.options.forEach((opt: any) => {
            if (!currentGroup) {
                currentGroup = { ...opt, optionIds: [opt._id] };
            } else {
                const isConsecutive = dayjs(currentGroup.endDate).add(1, 'day').isSame(dayjs(opt.startDate), 'day');
                const currentVoters = currentGroup.selectedBy.map((u:any)=>u._id).sort().join(',');
                const optVoters = opt.selectedBy.map((u:any)=>u._id).sort().join(',');
                
                if (isConsecutive && currentVoters === optVoters) {
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
    }, [poll.options]);

    const handleListToggle = (optionIds: string[], includeMe: boolean) => {
        setPoll((prevPoll: any) => {
            const newOptions = prevPoll.options.map((opt: any) => {
                if (optionIds.includes(opt._id)) {
                    if (includeMe) {
                        return { ...opt, selectedBy: opt.selectedBy.filter((u: any) => u._id !== me._id) };
                    } else {
                        return { ...opt, selectedBy: [...opt.selectedBy, me] };
                    }
                }
                return opt;
            });
            return { ...prevPoll, options: newOptions.filter((opt: any) => opt.selectedBy.length > 0) };
        });
    };

    return (
        <Animated.ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom }} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ headerRight: () => null, title: "Détail du sondage" }} />

            <View className={`m-2 mb-4 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 ${viewMode === 'calendar' ? 'pb-0 overflow-hidden' : 'p-4'}`}>
                
                <View className={`${viewMode === 'calendar' ? 'p-4 pb-0' : ''}`}>
                    <View className="flex-row items-center gap-2 mb-4">
                        <Avatar src={poll.createdBy.avatar} alt={poll.createdBy.name.charAt(0)} size2="sm" />
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">{poll.createdBy.name}</Text>
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-2xl font-bold dark:text-white mb-2">{poll.question}</Text>
                        
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
                    </View>
                </View>

                {viewMode === 'calendar' ? (
                    <SharedCalendar poll={poll} me={me} onToggleDay={handleToggleDay} />
                ) : (
                    <View className="gap-4 mb-4">
                        {groupedOptions.map((group: any) => {
                            const includeMe = group.selectedBy.some((u: any) => u._id === me._id);
                            const start = dayjs(group.startDate);
                            const end = dayjs(group.endDate);
                            const label = start.isSame(end, 'day') 
                                ? start.format("DD MMM YYYY") 
                                : `${start.format("DD")} au ${end.format("DD MMM YYYY")}`;

                            return (
                                <Button
                                    key={group.optionIds.join('-')}
                                    onPress={() => handleListToggle(group.optionIds, includeMe)}
                                    onLongPress={() => setSelectedOption(group)}
                                    className={`rounded-xl border-2 ${includeMe ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'}`}
                                >
                                    <PollOption
                                        label={label}
                                        selectedBy={group.selectedBy}
                                        percent={(group.selectedBy.length / Math.max(poll.hasSelected.length, 1)) * 100}
                                        isAnonymous={poll.isAnonymous}
                                        includeUser={includeMe}
                                        isLoading={false}
                                    />
                                </Button>
                            );
                        })}
                        
                        <View className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <Button 
                                variant="contained" 
                                size="small" 
                                icon="plus" 
                                title="Ajouter une proposition" 
                                onPress={() => setIsRangePickerOpen(true)} 
                            />
                        </View>
                    </View>
                )}
            </View>

            <PickUsersModal open={!!selectedOption && !poll.isAnonymous} onClose={() => setSelectedOption(null)} users={selectedOption?.selectedBy || []} disabled title="Votants" />
            <DateRangePickerModal visible={isRangePickerOpen} onClose={() => setIsRangePickerOpen(false)} onValidate={handleAddOptionRange} />
        </Animated.ScrollView>
    );
}