import { IconSymbol } from "@/components/ui/IconSymbol";
import "@/lib/calendarLocale";
import dayjs from "@/lib/dayjs-config";
import React, { createContext, useContext, useMemo } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { Calendar } from "react-native-calendars";

// Tokens de global.css (charte « All In ») en hex : ces valeurs vont dans des props `style`
// ou dans le thème de react-native-calendars, qui n'acceptent pas de classes Tailwind.
const NIGHT = "#16265C";
const INK = "#101736";
const MIST = "#F6F8FD";
const AMBER_DEEP = "#EE8B33";

type CalendarDayContextValue = {
    optionsByDate: Map<string, any>;
    userColors: Map<string, string>;
    userNames: Map<string, string>;
    meId: string;
    isClosed: boolean;
    isAnonymous: boolean;
    onToggleDay: (day: any) => void;
};

const CalendarDayContext = createContext<CalendarDayContextValue | null>(null);

// Couleurs de données (une par votant) : doivent rester distinctes entre elles, donc hex bruts.
// Sans ambre/orange (réservés à la charte et à la case « moi ») ni vert (plus dans la charte).
const USER_COLORS = [
    "#3b82f6", "#E5484D", "#a855f7", "#0ea5e9", "#ec4899",
    "#6366f1", "#64748b", "#be185d", "#0369a1", "#7c3aed",
];

// « Chaleur » du nombre de votes : ambre de plus en plus soutenu (remplace l'ancien dégradé vert)
const getCellBackground = (voteCount: number, dark: boolean) => {
    if (voteCount === 0) return dark ? INK : MIST;
    // Sur fond sombre l'ambre translucide vire au brun : on le renforce
    if (voteCount <= 2) return dark ? "rgba(247, 183, 74, 0.45)" : "rgba(247, 183, 74, 0.28)";
    if (voteCount <= 4) return dark ? "rgba(247, 183, 74, 0.75)" : "rgba(247, 183, 74, 0.65)";
    return AMBER_DEEP;
};

// Un votant peut être un objet utilisateur ou simplement un id
const getVoterId = (voter: any): string | undefined =>
    typeof voter === "string" ? voter : voter?._id ? String(voter._id) : undefined;

const optionDateKey = (opt: any) => dayjs(opt.startDate).format("YYYY-MM-DD");

function CalendarDay({ date, state }: any) {
    const ctx = useContext(CalendarDayContext);
    const dark = useColorScheme() === "dark";

    if (!date?.dateString || !ctx) return <View className="w-full aspect-[0.65]" />;

    const { optionsByDate, userColors, userNames, meId, isClosed, isAnonymous, onToggleDay } = ctx;
    const optionForDay = optionsByDate.get(date.dateString);
    const voters = optionForDay?.selectedBy || [];
    const voteCount = voters.length;
    const isSelectedByMe = !!meId && voters.some((u: any) => getVoterId(u) === meId);
    const visibleVoters = voters.slice(0, 3);
    const extraVoters = voters.length - 3;
    const isCurrentMonth = state !== "disabled";
    const dayJsDate = dayjs(date.dateString);

    // Ma pastille : bleu nuit en clair, blanc en sombre (l'ambre est déjà pris par la chaleur des cases)
    const meChip = dark ? { bg: "#FFFFFF", text: NIGHT } : { bg: NIGHT, text: "#FFFFFF" };

    return (
        <Pressable
            disabled={isClosed}
            onPress={() => onToggleDay(dayJsDate)}
            className={`w-full aspect-[0.65] p-[2px] ${!isCurrentMonth ? "opacity-40" : ""}`}
            style={{
                backgroundColor: getCellBackground(voteCount, dark),
                borderWidth: isSelectedByMe ? 2 : 1,
                borderColor: isSelectedByMe ? AMBER_DEEP : dark ? "rgba(255,255,255,0.1)" : "rgba(22,38,92,0.1)",
                zIndex: isSelectedByMe ? 10 : 0,
            }}
        >
            <View className="flex-row justify-between items-start">
                <Text className={`text-xs font-semibold ${isCurrentMonth ? "text-night dark:text-white" : "text-night/40 dark:text-white/40"}`}>
                    {date.day}
                </Text>
            </View>

            <View className="flex-1 justify-end overflow-hidden mt-[2px] gap-[1px]">
                {isAnonymous ? (
                    voteCount > 0 ? (
                        <View className="px-[2px] py-[1px] rounded-sm bg-night/70 dark:bg-white/30">
                            <Text className="text-white font-bold text-[7px] text-center" numberOfLines={1}>
                                {voteCount} vote{voteCount > 1 ? "s" : ""}
                            </Text>
                        </View>
                    ) : null
                ) : (
                    <>
                        {visibleVoters.map((user: any, index: number) => {
                            const voterId = getVoterId(user);
                            const isMe = !!meId && voterId === meId;
                            const bgColor = isMe ? meChip.bg : (voterId && userColors.get(voterId)) || "#94a3b8";
                            const textColor = isMe ? meChip.text : "#FFFFFF";
                            // Pseudo choisi pour ce voyage (trip.users), sinon nom présent dans le vote.
                            // « Moi » porte le même pseudo que les autres, repéré par sa pastille et la bordure ambre.
                            const displayName = (voterId && userNames.get(voterId)) || user?.name || "...";
                            const uniqueKey = `${date.dateString}-${voterId ?? index}`;

                            return (
                                <View key={uniqueKey} style={{ backgroundColor: bgColor }} className="px-[2px] py-[1px] rounded-sm">
                                    <Text style={{ color: textColor }} className="font-bold text-[7px]" numberOfLines={1} ellipsizeMode="clip">
                                        {displayName}
                                    </Text>
                                </View>
                            );
                        })}
                        {extraVoters > 0 && (
                            <View className="px-[2px] py-[1px] rounded-sm bg-night/15 dark:bg-white/20">
                                <Text className="text-night dark:text-white font-bold text-[7px] text-center">
                                    +{extraVoters}
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        </Pressable>
    );
}

export default function SharedCalendar({ poll, me, users, onToggleDay }: any) {
    const dark = useColorScheme() === "dark";
    const initialDate = poll?.options?.[0]?.startDate
        ? dayjs(poll.options[0].startDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");
    const safeMeId: string = me?._id ?? "";

    const optionsByDate = useMemo(() => {
        const map = new Map<string, any>();
        poll?.options?.forEach((opt: any) => {
            map.set(optionDateKey(opt), opt);
        });
        return map;
    }, [poll?.options]);

    // Couleur stable par utilisateur : on trie les ids puis on distribue la palette (aucun doublon tant qu'il y a <= 10 votants)
    const userColors = useMemo(() => {
        const ids = new Set<string>();
        poll?.options?.forEach((opt: any) => {
            opt.selectedBy?.forEach((u: any) => {
                const uid = getVoterId(u);
                if (uid) ids.add(uid);
            });
        });
        const map = new Map<string, string>();
        [...ids].sort().forEach((uid, index) => map.set(uid, USER_COLORS[index % USER_COLORS.length]));
        return map;
    }, [poll?.options]);

    // Pseudo de chaque participant pour CE voyage (trip.users)
    const meName: string | undefined = me?.name;
    const userNames = useMemo(() => {
        const map = new Map<string, string>();
        (users || []).forEach((u: any) => {
            if (u?._id && u?.name) map.set(String(u._id), u.name);
        });
        // Filet de sécurité : mon propre pseudo, même si trip.users n'est pas encore chargé
        if (safeMeId && meName && !map.has(safeMeId)) map.set(safeMeId, meName);
        return map;
    }, [users, safeMeId, meName]);

    const ctxValue = useMemo(
        () => ({
            optionsByDate,
            userColors,
            userNames,
            meId: safeMeId,
            isClosed: Boolean(poll?.isClosed),
            isAnonymous: Boolean(poll?.isAnonymous),
            onToggleDay,
        }),
        [optionsByDate, userColors, userNames, safeMeId, poll?.isClosed, poll?.isAnonymous, onToggleDay]
    );

    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};
        poll?.options?.forEach((opt: any) => {
            const dateStr = optionDateKey(opt);
            const voterStamp = (opt.selectedBy || []).map((u: any) => getVoterId(u)).join(",");
            marks[dateStr] = {
                marked: true,
                selected: !!safeMeId && (opt.selectedBy || []).some((u: any) => getVoterId(u) === safeMeId),
                dots: [{ key: `${opt._id}-${voterStamp}` }],
            };
        });
        return marks;
    }, [poll?.options, safeMeId]);

    // Le thème suit le mode clair/sombre (le titre du mois était figé en gris foncé)
    const calendarTheme = useMemo(() => {
        const text = dark ? "#FFFFFF" : NIGHT;
        const muted = dark ? "rgba(255,255,255,0.6)" : "rgba(22,38,92,0.6)";
        return {
            calendarBackground: "transparent",
            textSectionTitleColor: muted,
            textSectionTitleDisabledColor: muted,
            monthTextColor: text,
            arrowColor: AMBER_DEEP,
            textMonthFontWeight: "bold" as const,
            textMonthFontSize: 20,
            "stylesheet.calendar.header": {
                header: {
                    flexDirection: "row" as const,
                    justifyContent: "space-between" as const,
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginTop: 6,
                    alignItems: "center" as const,
                    marginBottom: 10,
                },
                dayHeader: {
                    marginTop: 2,
                    marginBottom: 7,
                    width: 32,
                    textAlign: "center" as const,
                    fontSize: 12,
                    color: muted,
                    fontWeight: "bold" as const,
                },
            },
        } as any; // les clés "stylesheet.*" ne sont pas dans le type Theme de react-native-calendars
    }, [dark]);

    const legend = [
        { label: "1-2", color: getCellBackground(1, dark) },
        { label: "3-4", color: getCellBackground(3, dark) },
        { label: "5+", color: getCellBackground(5, dark) },
    ];

    return (
        <CalendarDayContext.Provider value={ctxValue}>
            <View className="flex-1 bg-white dark:bg-night pb-4">
                <Calendar
                    // react-native-calendars fige son style au montage : on le remonte quand le mode clair/sombre change
                    key={dark ? "dark" : "light"}
                    current={initialDate}
                    firstDay={1}
                    hideExtraDays={false}
                    markedDates={markedDates}
                    dayComponent={CalendarDay}
                    renderArrow={(direction: "left" | "right") => (
                        <IconSymbol name={direction === "left" ? "chevron.left" : "chevron.right"} size={24} color={AMBER_DEEP} />
                    )}
                    theme={calendarTheme}
                />

                <View className="flex-row items-center justify-center gap-4 py-4 border-t border-night/10 dark:border-white/10 mt-2">
                    {legend.map(({ label, color }) => (
                        <View key={label} className="flex-row items-center gap-1">
                            <View style={{ backgroundColor: color }} className="w-4 h-4 rounded border border-night/10 dark:border-white/10" />
                            <Text className="text-night/60 dark:text-white/60 text-xs font-semibold">{label}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </CalendarDayContext.Provider>
    );
}
