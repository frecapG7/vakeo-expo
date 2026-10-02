import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { HousingOptions } from "@/components/polls/HousingOptions";
import { PollOption } from "@/components/polls/PollOption";
import SharedCalendar from "@/components/polls/SharedCalendar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetPoll, usePutPoll, useUnvotePoll, useVotePoll } from "@/hooks/api/usePolls";
import { useTrip } from "@/context/TripContext";
import { useGetPoll, useUnvotePoll, useVotePoll } from "@/hooks/api/usePolls";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import dayjs from "@/lib/dayjs-config";

import { PollOption as Option } from "@/types/models";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

let MOCK_DB_LOCAL: any = null;

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
    const { id, pollId, mockType, mockData } = useLocalSearchParams<any>();
    const insets = useSafeAreaInsets();
    const { me, trip } = useContext(TripContext);
    const meId = me?._id;

    const isMock = pollId === "mock_poll_123";

    const { data: realPoll } = useGetPoll(id, pollId);
    const votePoll = useVotePoll(id, pollId, meId);
    const unvotePoll = useUnvotePoll(id, pollId, meId);
    const updatePoll = usePutPoll(id, pollId, meId);

    const [mockPollState, setMockPollState] = useState<any>(null);
    const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);
    const initializedMock = useRef(false);
    const isSavingRef = useRef(false);

    // Un votant est "moi" uniquement si son vrai _id correspond à celui de l'utilisateur connecté
    const isMine = (u: any) => !!meId && (typeof u === "string" ? u : u?._id) === meId;

    // On attend que l'utilisateur soit chargé : sinon on enregistrerait un faux utilisateur "Moi"
    useEffect(() => {
        if (!isMock || !me) return;

        if (!initializedMock.current) {
            if (mockData) {
                try {
                    const parsed = JSON.parse(mockData);
                    const parsedOptions = parsed.options.map((opt: any, index: number) => ({
                        _id: "opt_mock_" + index,
                        startDate: opt.startDate,
                        endDate: opt.endDate,
                        selectedBy: [me]
                    }));

                    MOCK_DB_LOCAL = {
                        _id: "mock_poll_123",
                        type: "DatesPoll",
                        question: parsed.question,
                        createdBy: me,
                        isAnonymous: false,
                        isClosed: false,
                        options: parsedOptions
                    };
                } catch (e) {
                    console.error("Erreur de transfert Mock", e);
                }
            } else if (!MOCK_DB_LOCAL) {
                MOCK_DB_LOCAL = {
                    _id: "mock_poll_123",
                    type: "DatesPoll",
                    question: mockType === "calendar" ? "Mock: Quand êtes-vous disponibles ?\u200B" : "Mock: Sondage Liste",
                    createdBy: me,
                    isAnonymous: false,
                    isClosed: false,
                    options: []
                };
            }
            initializedMock.current = true;
        }
        if (MOCK_DB_LOCAL) setMockPollState({ ...MOCK_DB_LOCAL });
    }, [isMock, mockData, mockType, me]);

    const poll = isMock ? mockPollState : realPoll;
    const displayPoll = poll ?? null;

    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [loadingOptionId, setLoadingOptionId] = useState<string | null>(null);

    const isCalendarFormat = displayPoll?.type === "DatesPoll" && displayPoll?.question?.endsWith("\u200B");

    // ---- Mock : ajoute / retire l'utilisateur courant sur une option
    const mockToggleVote = (optionId: string, hasVoted: boolean) => {
        MOCK_DB_LOCAL.options = MOCK_DB_LOCAL.options.map((opt: any) => {
            if (opt._id !== optionId) return opt;
            return hasVoted
                ? { ...opt, selectedBy: opt.selectedBy.filter((u: any) => !isMine(u)) }
                : { ...opt, selectedBy: [...opt.selectedBy, me] };
        });
        setMockPollState({ ...MOCK_DB_LOCAL });
    };

    // ---- Vrai backend : crée l'option (visible par tous), puis vote dessus si besoin
    const createOptionAndVote = async (startDate: string, endDate: string) => {
        const updated: any = await updatePoll.mutateAsync({
            newOptions: [{ startDate, endDate } as any]
        });
        const created = updated?.options?.find((o: any) =>
            dayjs(o.startDate).isSame(dayjs(startDate)) && dayjs(o.endDate).isSame(dayjs(endDate))
        );
        if (created && !created.selectedBy?.some(isMine)) {
            await votePoll.mutateAsync({ options: [created._id] });
        }
    };

    // =======================================
    // GESTION DES CLICS LISTE
    // =======================================
    const handleClick = async (option: Option, includeMe: boolean) => {
        if (!me) return;

        if (isMock) {
            mockToggleVote(option._id, includeMe);
            return;
        }

        setLoadingOptionId(option._id);
        try {
            if (includeMe) await unvotePoll.mutateAsync({ option: option._id });
            else await votePoll.mutateAsync({ options: [option._id] });
        } finally {
            setLoadingOptionId(null);
        }
    }

    // =======================================
    // GESTION DES CLICS CALENDRIER FINAL
    // =======================================
    const handleToggleDay = async (dayJsObj: any) => {
        if (!displayPoll || !me || isSavingRef.current) return;
        const targetDateStr = dayJsObj.format('YYYY-MM-DD');
        const option = displayPoll.options?.find((opt: any) => dayjs(opt.startDate).format('YYYY-MM-DD') === targetDateStr);

        isSavingRef.current = true;
        try {
            // 1. LE JOUR EXISTE DÉJÀ
            if (option) {
                const hasVoted = option.selectedBy?.some(isMine);

                if (isMock) mockToggleVote(option._id, hasVoted);
                else if (hasVoted) await unvotePoll.mutateAsync({ option: option._id });
                else await votePoll.mutateAsync({ options: [option._id] });
            }
            // 2. LE JOUR EST NOUVEAU (clic sur case grise)
            else {
                // On force l'heure à midi pour éviter les décalages de fuseau horaire.
                const safeDate = dayjs(targetDateStr).hour(12).toISOString();

                if (isMock) {
                    MOCK_DB_LOCAL.options = [...(MOCK_DB_LOCAL.options || []), {
                        _id: "opt_mock_" + Date.now(),
                        startDate: safeDate,
                        endDate: safeDate,
                        selectedBy: [me]
                    }];
                    setMockPollState({ ...MOCK_DB_LOCAL });
                } else {
                    await createOptionAndVote(safeDate, safeDate);
                }
            }
        } finally {
            isSavingRef.current = false;
        }
    };

    const handleAddOptionRange = async (start: any, end: any) => {
        if (!me) return;
        const safeStart = start.hour(12).toISOString();
        const safeEnd = end.hour(12).toISOString();
        setIsRangePickerOpen(false);

        if (isMock) {
            MOCK_DB_LOCAL.options = [...(MOCK_DB_LOCAL.options || []), {
                _id: "opt_mock_" + Date.now(),
                startDate: safeStart,
                endDate: safeEnd,
                selectedBy: [me]
            }];
            setMockPollState({ ...MOCK_DB_LOCAL });
        } else {
            await createOptionAndVote(safeStart, safeEnd);
        }
    };

    const groupedOptions = useMemo(() => {
        if (displayPoll?.type !== "DatesPoll" || !displayPoll?.options) return [];
        const groups: any[] = [];
        let currentGroup: any = null;
        const sortedOptions = [...displayPoll.options].sort((a: any, b: any) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf());

        sortedOptions.forEach((opt: any) => {
            if (!currentGroup) {
                currentGroup = { ...opt, optionIds: [opt._id] };
            } else {
                const isConsecutive = dayjs(currentGroup.endDate).add(1, 'day').isSame(dayjs(opt.startDate), 'day');
                const isSameVotes = displayPoll.isAnonymous 
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
    }, [displayPoll?.options, displayPoll?.type, displayPoll?.isAnonymous]);

    if (!displayPoll)
        return (
            <View style={styles.container}>
                <View className="flex-row gap-3 items-center p-4">
                    <Skeleton variant="circular" size="md" />
                    <View className="flex-1 gap-2">
                        <Skeleton height={8} width="60%" />
                    </View>
                </View>
                <View className="gap-4 my-4 px-4">
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                </View>
            </View>
        );

    return (
        <Animated.ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom }} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ headerRight: () => null, title: isCalendarFormat ? "Disponibilités" : "Détail du sondage" }} />

            {isMock && (
                <View className="bg-red-500 p-2 items-center">
                    <Text className="text-white font-bold text-xs">⚠️ MODE SIMULATION (MOCK)</Text>
                </View>
            )}

            <View className={`m-2 mb-4 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 ${isCalendarFormat ? 'pb-0 overflow-hidden' : 'p-4'}`}>
                
                <View className={`${isCalendarFormat ? 'p-4 pb-0' : ''}`}>
                    <View className="flex-row items-center gap-2 mb-4">
                        <Avatar src={displayPoll.createdBy?.avatar} alt={displayPoll.createdBy?.name?.charAt(0)} size2="sm" />
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">{displayPoll.createdBy?.name}</Text>
                        </View>
                    </View>
                    <View className="mb-4">
                        <Text className="text-2xl font-bold dark:text-white">{displayPoll.question.replace('\u200B', '')}</Text>
                    </View>
                </View>

                {isCalendarFormat && (
                    <SharedCalendar poll={displayPoll} me={me} users={trip?.users} onToggleDay={handleToggleDay} />
                )}

                {!isCalendarFormat && displayPoll.type === "DatesPoll" && (
                    <View className="gap-4 mb-4">
                        {groupedOptions.map((group: any) => {
                            const includeMe = group.selectedBy?.some(isMine);
                            const start = dayjs(group.startDate);
                            const end = dayjs(group.endDate);
                            const label = start.isSame(end, 'day') ? start.format("DD MMM YYYY") : `${start.format("DD")} au ${end.format("DD MMM YYYY")}`;

                            return (
                                <Button
                                    key={group.optionIds.join('-')}
                                    onPress={() => handleClick(group, includeMe)}
                                    onLongPress={() => setSelectedOption(group)}
                                    className={`rounded-xl border-2 ${includeMe ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'}`}
                                >
                                    <PollOption label={label} selectedBy={group.selectedBy || []} percent={group.percent ?? 0} isAnonymous={displayPoll.isAnonymous} includeUser={includeMe} isLoading={loadingOptionId === group._id} />
                                </Button>
                            );
                        })}
                        
                        <View className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <Button variant="contained" size="small" icon="plus" title="Ajouter un choix de date" onPress={() => setIsRangePickerOpen(true)} />
                        </View>
                    </View>
                )}

                {displayPoll.type === "HousingPoll" && <HousingOptions poll={displayPoll} />}

                {displayPoll.type !== "DatesPoll" && displayPoll.type !== "HousingPoll" && (
                    <View className="gap-4 mb-4">
                        {displayPoll.options?.map((opt: Option) => {
                            const includeMe = opt.selectedBy?.some(isMine);
                            return (
                                <Button key={opt._id} onPress={() => handleClick(opt, includeMe)} onLongPress={() => setSelectedOption(opt)} className={`rounded-xl border-2 ${includeMe ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'}`}>
                                    <PollOption label={opt.label || ''} selectedBy={opt.selectedBy || []} percent={opt.percent ?? 0} isAnonymous={displayPoll.isAnonymous} includeUser={includeMe} isLoading={loadingOptionId === opt._id} />
                                </Button>
                            );
                        })}
                    </View>
                )}
            </View>

            <PickUsersModal open={!!selectedOption && !displayPoll.isAnonymous} onClose={() => setSelectedOption(null)} users={selectedOption?.selectedBy || []} disabled title="Votants" />
            
            <DateRangePickerModal visible={isRangePickerOpen} onClose={() => setIsRangePickerOpen(false)} onValidate={handleAddOptionRange} />
        </Animated.ScrollView>
    );
}