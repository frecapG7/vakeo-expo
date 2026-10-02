import { IconSymbol } from "@/components/ui/IconSymbol";
import dayjs from "@/lib/dayjs-config";
import React, { createContext, useContext, useMemo } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["fr"] = {
    monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    monthNamesShort: ["Janv.", "Févr.", "Mars", "Avril", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."],
    dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    dayNamesShort: ["DIM.", "LUN.", "MAR.", "MER.", "JEU.", "VEN.", "SAM."],
    today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

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

const ME_COLOR = "#f97316";

// Palette sans orange (réservé à "Moi") : chaque utilisateur du sondage reçoit une couleur différente
const USER_COLORS = [
    "#3b82f6", "#ef4444", "#a855f7", "#14b8a6", "#ec4899", "#ca8a04",
    "#6366f1", "#65a30d", "#0891b2", "#be123c", "#c026d3", "#78716c",
];

const getCellBackground = (voteCount: number, dark: boolean) => {
    if (voteCount === 0) return dark ? "#111827" : "#f9fafb";
    if (voteCount <= 2) return dark ? "rgba(20, 83, 45, 0.45)" : "#dcfce7";
    if (voteCount <= 4) return dark ? "rgba(21, 128, 61, 0.65)" : "#86efac";
    return dark ? "#16a34a" : "#22c55e";
};

// Un votant peut être un objet utilisateur ou simplement un id
const getVoterId = (voter: any): string | undefined =>
    typeof voter === "string" ? voter : voter?._id ? String(voter._id) : undefined;

const optionDateKey = (opt: any) => dayjs(opt.startDate).format("YYYY-MM-DD");

function CalendarDay({ date, state }: any) {
    const ctx = useContext(CalendarDayContext);
    const colorScheme = useColorScheme();
    const dark = colorScheme === "dark";

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

    return (
        <Pressable
            disabled={isClosed}
            onPress={() => onToggleDay(dayJsDate)}
            className={`w-full aspect-[0.65] p-[2px] ${!isCurrentMonth ? "opacity-40" : ""}`}
            style={{
                backgroundColor: getCellBackground(voteCount, dark),
                borderWidth: isSelectedByMe ? 1.5 : 1,
                borderColor: isSelectedByMe ? "#f97316" : dark ? "#1f2937" : "#e5e7eb",
                zIndex: isSelectedByMe ? 10 : 0,
            }}
        >
            <View className="flex-row justify-between items-start">
                <Text className={`text-xs font-semibold ${isCurrentMonth ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>
                    {date.day}
                </Text>
            </View>

            <View className="flex-1 justify-end overflow-hidden mt-[2px] gap-[1px]">
                {isAnonymous ? (
                    voteCount > 0 ? (
                        <View className="px-[2px] py-[1px] rounded-sm bg-gray-500/80">
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
                            const bgColor = isMe ? ME_COLOR : (voterId && userColors.get(voterId)) || "#9ca3af";
                            // Pseudo choisi pour ce voyage (trip.users), sinon nom présent dans le vote. Moi = même pseudo, repéré par la couleur orange
                            const displayName = (voterId && userNames.get(voterId)) || user?.name || "...";
                            const uniqueKey = `${date.dateString}-${voterId ?? index}`;

                            return (
                                <View key={uniqueKey} style={{ backgroundColor: bgColor }} className="px-[2px] py-[1px] rounded-sm">
                                    <Text className="text-white font-bold text-[7px]" numberOfLines={1} ellipsizeMode="clip">
                                        {displayName}
                                    </Text>
                                </View>
                            );
                        })}
                        {extraVoters > 0 && (
                            <View className="px-[2px] py-[1px] rounded-sm bg-gray-400/50 dark:bg-gray-700/50">
                                <Text className="text-gray-900 dark:text-white font-bold text-[7px] text-center">
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

    // Couleur stable par utilisateur : on trie les ids puis on distribue la palette (aucun doublon tant qu'il y a <= 12 votants)
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
    const userNames = useMemo(() => {
        const map = new Map<string, string>();
        (users || []).forEach((u: any) => {
            if (u?._id && u?.name) map.set(String(u._id), u.name);
        });
        // Filet de sécurité : mon propre pseudo, même si trip.users n'est pas encore chargé
        if (me?._id && me?.name && !map.has(String(me._id))) map.set(String(me._id), me.name);
        return map;
    }, [users, me?._id, me?.name]);

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

    const calendarTheme = useMemo(
        () => ({
            calendarBackground: "transparent",
            textSectionTitleColor: "#9ca3af",
            textSectionTitleDisabledColor: "#d1d5db",
            monthTextColor: "#111827",
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
                    color: "#9ca3af",
                    fontWeight: "bold" as const,
                },
            },
        }),
        []
    );

    return (
        <CalendarDayContext.Provider value={ctxValue}>
            <View className="flex-1 bg-white dark:bg-gray-950 pb-4">
                <Calendar
                    current={initialDate}
                    firstDay={1}
                    hideExtraDays={false}
                    markedDates={markedDates}
                    dayComponent={CalendarDay}
                    renderArrow={(direction: "left" | "right") => (
                        <IconSymbol name={direction === "left" ? "chevron.left" : "chevron.right"} size={24} color="gray" />
                    )}
                    theme={calendarTheme}
                />

                <View className="flex-row items-center justify-center gap-4 py-4 border-t border-gray-100 dark:border-gray-900 mt-2">
                    <View className="flex-row items-center gap-1">
                        <View className="w-4 h-4 rounded bg-green-100 border border-green-200" />
                        <Text className="text-gray-500 text-xs font-semibold">1-2</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <View className="w-4 h-4 rounded bg-green-300 border border-green-400" />
                        <Text className="text-gray-500 text-xs font-semibold">3-4</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <View className="w-4 h-4 rounded bg-green-500 border border-green-600" />
                        <Text className="text-gray-500 text-xs font-semibold">5+</Text>
                    </View>
                </View>
            </View>
        </CalendarDayContext.Provider>
    );
}
