import { CALENDAR_MARKER, MOCK_POLL_ID } from "@/components/polls/SharedCalendarPoll";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTrip } from "@/context/TripContext";
import { usePostPoll } from "@/hooks/api/usePolls";
import { v3Path } from "@/lib/api-v3";
import axios from "@/lib/axios";
import "@/lib/calendarLocale";
import dayjs from "@/lib/dayjs-config";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Tokens de global.css (charte « All In ») en hex, pour les props `style` / thème du calendrier.
const NIGHT = "#16265C";
const INK = "#101736";
const MIST = "#F6F8FD";
const AMBER_DEEP = "#EE8B33";

type PollFormat = "calendar" | "list";
type DateOption = { startDate: string, endDate: string };

// ==========================================
// CHOIX DU FORMAT DES DATES (calendrier / liste)
// ==========================================
export function DatesFormatPicker({ onSelect }: { onSelect: (format: PollFormat) => void }) {
    const dark = useColorScheme() === "dark";
    const [selected, setSelected] = useState<PollFormat | null>(null);

    const formats: { key: PollFormat, icon: "calendar" | "list.bullet", title: string, description: string }[] = [
        {
            key: "calendar",
            icon: "calendar",
            title: "Disponibilités (calendrier)",
            description: "Sélectionnez vos dates directement sur le calendrier. Les participants feront de même."
        },
        {
            key: "list",
            icon: "list.bullet",
            title: "Sondage classique (liste)",
            description: "Vous proposez des blocs de dates définis et les participants votent pour leurs favoris."
        },
    ];

    return (
        <View className="flex-1 p-4 pt-10 bg-mist dark:bg-ink">
            <Text className="text-h1 text-night dark:text-white text-center mb-8">Format des dates</Text>

            {formats.map(({ key, icon, title, description }) => {
                const isSelected = selected === key;
                return (
                    <TouchableOpacity
                        key={key}
                        activeOpacity={0.8}
                        onPress={() => setSelected(key)}
                        className={`p-6 rounded-2xl border-2 shadow-sm mb-4 items-center ${isSelected
                            ? "border-amber-deep bg-amber/10"
                            : "border-night/10 dark:border-white/10 bg-white dark:bg-night"}`}
                    >
                        <IconSymbol name={icon} size={48} color={isSelected ? AMBER_DEEP : dark ? "#FFFFFF" : NIGHT} />
                        <Text className="text-label text-night dark:text-white mt-4 mb-2">{title}</Text>
                        <Text className="text-sm text-center text-night/70 dark:text-white/60">{description}</Text>
                    </TouchableOpacity>
                );
            })}

            <View className="mt-auto pb-4">
                <Button title="Continuer" variant="contained" disabled={!selected} onPress={() => selected && onSelect(selected)} />
            </View>
        </View>
    );
}

// ==========================================
// CALENDRIER DE CRÉATION (sélection des dates proposées)
// ==========================================
const CreationCalendar = ({ options, onChange, me }: { options: DateOption[], onChange: (opts: DateOption[]) => void, me: any }) => {
    const dark = useColorScheme() === "dark";
    const [pendingStart, setPendingStart] = useState<any>(null);

    const optionsByDate = useMemo(() => {
        const map = new Map<string, boolean>();
        options.forEach(opt => map.set(dayjs(opt.startDate).format("YYYY-MM-DD"), true));
        return map;
    }, [options]);

    // 1er clic : une date. 2e clic sur une autre date : toute la période entre les deux.
    const handleToggleDay = (day: any) => {
        const targetDateStr = day.format("YYYY-MM-DD");

        if (optionsByDate.has(targetDateStr)) {
            onChange(options.filter(opt => dayjs(opt.startDate).format("YYYY-MM-DD") !== targetDateStr));
            if (pendingStart && day.isSame(pendingStart, "day")) setPendingStart(null);
            return;
        }

        if (!pendingStart) {
            setPendingStart(day);
            onChange([...options, { startDate: day.startOf("day").toISOString(), endDate: day.endOf("day").toISOString() }]);
            return;
        }

        const start = pendingStart.isBefore(day) ? pendingStart : day;
        const end = pendingStart.isBefore(day) ? day : pendingStart;
        const newOptions = [...options];

        for (let current = start.startOf("day"); !current.isAfter(end, "day"); current = current.add(1, "day")) {
            if (!optionsByDate.has(current.format("YYYY-MM-DD"))) {
                newOptions.push({ startDate: current.startOf("day").toISOString(), endDate: current.endOf("day").toISOString() });
            }
        }

        newOptions.sort((a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf());
        onChange(newOptions);
        setPendingStart(null);
    };

    const renderDay = (date: DateData & { state: string }) => {
        const isSelected = optionsByDate.has(date.dateString);
        const isCurrentMonth = date.state !== "disabled";

        return (
            <Pressable
                onPress={() => handleToggleDay(dayjs(date.dateString))}
                className={`w-full aspect-[0.65] p-[2px] ${!isCurrentMonth ? "opacity-40" : ""}`}
                style={{
                    backgroundColor: isSelected ? (dark ? "rgba(247, 183, 74, 0.55)" : "rgba(247, 183, 74, 0.35)") : dark ? INK : MIST,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? AMBER_DEEP : dark ? "rgba(255,255,255,0.1)" : "rgba(22,38,92,0.1)",
                    zIndex: isSelected ? 10 : 0,
                }}
            >
                <Text className={`text-xs font-semibold ${isCurrentMonth ? "text-night dark:text-white" : "text-night/40 dark:text-white/40"}`}>
                    {date.day}
                </Text>
                <View className="flex-1 justify-end overflow-hidden mt-[2px]">
                    {isSelected && (
                        <View className="px-[2px] py-[1px] rounded-sm bg-night dark:bg-white">
                            <Text className="text-white dark:text-night font-bold text-[7px]" numberOfLines={1} ellipsizeMode="clip">
                                {me?.name || "Moi"}
                            </Text>
                        </View>
                    )}
                </View>
            </Pressable>
        );
    };

    const muted = dark ? "rgba(255,255,255,0.6)" : "rgba(22,38,92,0.6)";

    return (
        <View className="flex-1 pb-4">
            {/* Hauteur réservée en permanence : sinon le calendrier descend au 1er clic et le 2e tap rate sa cible */}
            <View className="h-6 justify-center">
                {pendingStart && (
                    <Text className="text-center text-xs text-amber-deep font-bold">Sélectionnez la date de fin...</Text>
                )}
            </View>
            <Calendar
                // react-native-calendars fige son style au montage : on le remonte quand le mode clair/sombre change
                key={dark ? "dark" : "light"}
                current={dayjs().format("YYYY-MM-DD")}
                firstDay={1}
                hideExtraDays={false}
                renderArrow={(direction: "left" | "right") => (
                    <IconSymbol name={direction === "left" ? "chevron.left" : "chevron.right"} size={24} color={AMBER_DEEP} />
                )}
                theme={{
                    calendarBackground: "transparent",
                    textSectionTitleColor: muted,
                    textSectionTitleDisabledColor: muted,
                    monthTextColor: dark ? "#FFFFFF" : NIGHT,
                    arrowColor: AMBER_DEEP,
                    textMonthFontWeight: "bold",
                    textMonthFontSize: 20,
                    "stylesheet.calendar.header": {
                        header: { flexDirection: "row", justifyContent: "space-between", paddingLeft: 10, paddingRight: 10, marginTop: 6, alignItems: "center", marginBottom: 10 },
                        dayHeader: { marginTop: 2, marginBottom: 7, width: 32, textAlign: "center", fontSize: 12, color: muted, fontWeight: "bold" }
                    }
                } as any /* les clés "stylesheet.*" ne sont pas dans le type Theme de react-native-calendars */}
                dayComponent={({ date, state }: any) => renderDay({ ...date, state })}
            />
        </View>
    );
};

// ==========================================
// PAGE DE CRÉATION D'UN SONDAGE « CALENDRIER »
// ==========================================
export default function CalendarPollCreation() {
    const { trip, me } = useTrip();
    const { stop } = useLocalSearchParams<{ stop?: string }>();
    const router = useRouter();
    const postPoll = usePostPoll(trip?._id, me?._id);
    const queryClient = useQueryClient();
    const insets = useSafeAreaInsets();
    const dark = useColorScheme() === "dark";

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<DateOption[]>([]);

    const onSubmit = async () => {
        const trimmedQuestion = question.trim();
        try {
            // Même payload que le formulaire « liste » (pas de selectedBy : champ calculé côté serveur)
            const result = await postPoll.mutateAsync({
                question: trimmedQuestion + CALENDAR_MARKER,
                type: "DatesPoll",
                isSingleAnswer: false,
                isAnonymous: false,
                options: options.map(({ startDate, endDate }) => ({ startDate, endDate })),
                ...(stop && { stop })
            } as any);

            // Le créateur vote sur les dates qu'il propose (route de vote standard).
            // Échec non bloquant : le sondage est créé, il pourra voter depuis le calendrier.
            try {
                const optionIds = (result.options ?? []).map((o: any) => o._id).filter(Boolean);
                if (optionIds.length > 0 && me?._id) {
                    const voted = await axios.patch(v3Path(`/trips/${trip?._id}/polls/${result._id}/vote`),
                        { options: optionIds },
                        { headers: { "x-user-id": me._id } });
                    queryClient.setQueryData(["trips", trip?._id, "polls", result._id], voted.data);
                }
            } catch (voteError) {
                console.warn("Vote automatique du créateur impossible", voteError);
            }

            router.dismissTo({
                pathname: "/[id]/polls/[pollId]",
                params: { id: trip?._id, pollId: result._id }
            });
        } catch (error) {
            console.error("Création du sondage calendrier : échec API", (error as any)?.response?.data ?? error);
            // Simulation de secours (uniquement si l'API échoue)
            Alert.alert("Mode simulation", "Le serveur a refusé la création : le sondage est simulé sur cet appareil.");
            router.dismissTo({
                pathname: "/[id]/polls/[pollId]",
                params: {
                    id: trip?._id,
                    pollId: MOCK_POLL_ID,
                    mockType: "calendar",
                    mockData: JSON.stringify({ question: trimmedQuestion + CALENDAR_MARKER, options })
                }
            });
        }
    };

    return (
        <View className="flex-1 bg-mist dark:bg-ink">
            <Animated.ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <View className="m-4 rounded-2xl bg-white dark:bg-night border border-mist dark:border-white/10 shadow-sm overflow-hidden">
                    <View className="p-4 pb-0">
                        <View className="flex-row items-center gap-2 mb-4">
                            <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="sm" />
                            <Text className="flex-1 text-sm font-medium text-night/70 dark:text-white/60" numberOfLines={1}>
                                {me?.name}
                            </Text>
                        </View>
                        <TextInput
                            value={question}
                            onChangeText={setQuestion}
                            placeholder="Quand êtes-vous disponibles ?"
                            placeholderTextColor={dark ? "rgba(255,255,255,0.4)" : "rgba(22,38,92,0.4)"}
                            className="text-h1 text-night dark:text-white mb-4 p-0"
                            multiline
                            maxLength={255}
                        />
                    </View>
                    <CreationCalendar options={options} onChange={setOptions} me={me} />
                </View>
            </Animated.ScrollView>

            <View
                className="absolute bottom-0 left-0 right-0 p-4 bg-mist/90 dark:bg-ink/90 border-t border-night/10 dark:border-white/10"
                style={{ paddingBottom: 16 + insets.bottom }}
            >
                <Button
                    variant="contained"
                    icon="tray"
                    title="Lancer le sondage"
                    onPress={onSubmit}
                    isLoading={postPoll?.isPending}
                    disabled={!question.trim() || options.length === 0}
                />
            </View>
        </View>
    );
}
