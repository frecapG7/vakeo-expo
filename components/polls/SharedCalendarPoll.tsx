import SharedCalendar from "@/components/polls/SharedCalendar";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTrip } from "@/context/TripContext";
import { usePutPoll, useUnvotePoll, useVotePoll } from "@/hooks/api/usePolls";
import dayjs from "@/lib/dayjs-config";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Marqueur invisible en fin de question : distingue un sondage « calendrier » d'un sondage de dates classique. */
export const CALENDAR_MARKER = "\u200B";
export const MOCK_POLL_ID = "mock_poll_123";

export const isCalendarPoll = (poll?: { type?: string, question?: string } | null): boolean =>
    poll?.type === "DatesPoll" && !!poll?.question?.endsWith(CALENDAR_MARKER);

export const stripCalendarMarker = (question?: string): string => question?.replace(CALENDAR_MARKER, "") ?? "";

// Base de données de simulation (mémoire de l'app) quand l'API est injoignable à la création.
let MOCK_DB_LOCAL: any = null;

/** Crée (ou récupère) la base de simulation à partir des données passées par l'écran de création. */
const initMockDb = (me: any, mockData?: string, mockType?: string) => {
    if (mockData) {
        try {
            const parsed = JSON.parse(mockData);
            MOCK_DB_LOCAL = {
                _id: MOCK_POLL_ID,
                type: "DatesPoll",
                question: parsed.question,
                createdBy: me,
                isAnonymous: false,
                isClosed: false,
                options: parsed.options.map((opt: any, index: number) => ({
                    _id: "opt_mock_" + index,
                    startDate: opt.startDate,
                    endDate: opt.endDate,
                    selectedBy: [me]
                }))
            };
        } catch (e) {
            console.error("Erreur de transfert Mock", e);
        }
    } else if (!MOCK_DB_LOCAL) {
        MOCK_DB_LOCAL = {
            _id: MOCK_POLL_ID,
            type: "DatesPoll",
            question: (mockType === "calendar" ? "Mock: Quand êtes-vous disponibles ?" : "Mock: Sondage") + CALENDAR_MARKER,
            createdBy: me,
            isAnonymous: false,
            isClosed: false,
            options: []
        };
    }
    return MOCK_DB_LOCAL ? { ...MOCK_DB_LOCAL } : null;
};

type Props = {
    id: string,
    pollId: string,
    /** Sondage réel (absent en mode simulation). */
    poll?: any,
    mockType?: string,
    mockData?: string,
};

/**
 * Détail d'un sondage « calendrier » (disponibilités partagées).
 * Rendu par `app/[id]/polls/[pollId]` uniquement si `SHARED_CALENDAR_ENABLED` (constants/Features.ts).
 */
export default function SharedCalendarPoll({ id, pollId, poll: realPoll, mockType, mockData }: Props) {
    const insets = useSafeAreaInsets();
    const { me, trip } = useTrip();
    const meId = me?._id;

    const isMock = pollId === MOCK_POLL_ID;

    const votePoll = useVotePoll(id, pollId, meId);
    const unvotePoll = useUnvotePoll(id, pollId, meId);
    const updatePoll = usePutPoll(id, pollId, meId);

    const [mockPollState, setMockPollState] = useState<any>(null);
    const isSavingRef = useRef(false);

    // Un votant est « moi » uniquement si son vrai _id correspond à celui de l'utilisateur connecté
    const isMine = (u: any) => !!meId && (typeof u === "string" ? u : u?._id) === meId;

    // Initialisation de la simulation une fois l'utilisateur chargé (sinon on enregistrerait un faux utilisateur).
    // Mise à jour d'état pendant le rendu, gardée par la condition : motif React recommandé (pas d'effet).
    if (isMock && me && !mockPollState)
        setMockPollState(initMockDb(me, mockData, mockType));

    const poll = isMock ? mockPollState : realPoll;

    // ---- Simulation : ajoute / retire l'utilisateur courant sur une option
    const mockToggleVote = (optionId: string, hasVoted: boolean) => {
        MOCK_DB_LOCAL.options = MOCK_DB_LOCAL.options.map((opt: any) => {
            if (opt._id !== optionId) return opt;
            return hasVoted
                ? { ...opt, selectedBy: opt.selectedBy.filter((u: any) => !isMine(u)) }
                : { ...opt, selectedBy: [...opt.selectedBy, me] };
        });
        setMockPollState({ ...MOCK_DB_LOCAL });
    };

    // ---- Vrai backend : crée l'option (visible par tous les participants), puis vote dessus si besoin
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

    const handleToggleDay = async (dayJsObj: any) => {
        if (!poll || !me || isSavingRef.current) return;
        const targetDateStr = dayJsObj.format("YYYY-MM-DD");
        const option = poll.options?.find((opt: any) => dayjs(opt.startDate).format("YYYY-MM-DD") === targetDateStr);

        isSavingRef.current = true;
        try {
            if (option) {
                // Le jour existe déjà : on ajoute / retire mon vote
                const hasVoted = option.selectedBy?.some(isMine);

                if (isMock) mockToggleVote(option._id, hasVoted);
                else if (hasVoted) await unvotePoll.mutateAsync({ option: option._id });
                else await votePoll.mutateAsync({ options: [option._id] });
            } else {
                // Jour nouveau (case vide) : on force midi pour éviter les décalages de fuseau horaire
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

    if (!poll)
        return (
            <View className="flex-1 bg-mist dark:bg-ink p-4 gap-4">
                <Skeleton height={50} />
                <Skeleton height={300} />
            </View>
        );

    return (
        <Animated.ScrollView
            className="flex-1 bg-mist dark:bg-ink"
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            showsVerticalScrollIndicator={false}
        >
            <Stack.Screen options={{ title: "Disponibilités" }} />

            {isMock && (
                <View className="bg-danger p-2 items-center">
                    <Text className="text-white font-bold text-xs">MODE SIMULATION (API injoignable)</Text>
                </View>
            )}

            <View className="m-4 rounded-2xl bg-white dark:bg-night border border-mist dark:border-white/10 shadow-sm overflow-hidden">
                <View className="p-4 pb-0">
                    <View className="flex-row items-center gap-2 mb-4">
                        <Avatar src={poll.createdBy?.avatar} alt={poll.createdBy?.name?.charAt(0)} size2="sm" />
                        <Text className="flex-1 text-sm font-medium text-night/70 dark:text-white/60" numberOfLines={1}>
                            {poll.createdBy?.name}
                        </Text>
                    </View>
                    <Text className="text-h1 text-night dark:text-white mb-4">{stripCalendarMarker(poll.question)}</Text>
                </View>

                <SharedCalendar poll={poll} me={me} users={trip?.users} onToggleDay={handleToggleDay} />
            </View>
        </Animated.ScrollView>
    );
}
