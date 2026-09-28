import SharedCalendar from "@/components/polls/SharedCalendar";
import { Avatar } from "@/components/ui/Avatar";
import styles from "@/constants/Styles";
import dayjs from "@/lib/dayjs-config";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_ME = { _id: "u_me", name: "Moi", avatar: null };
const MOCK_USERS = [
    { _id: "u1", name: "Thomas", avatar: null },
    { _id: "u2", name: "Marie", avatar: null }
];

const INITIAL_CALENDAR = {
    _id: "mock_cal_123",
    type: "AvailabilityCalendar",
    question: "Quand êtes-vous disponibles ?",
    createdBy: MOCK_USERS[0],
    isAnonymous: false,
    isClosed: false,
    options: [
        { _id: "opt_1", startDate: dayjs().add(2, 'day').toISOString(), endDate: dayjs().add(2, 'day').toISOString(), selectedBy: [MOCK_USERS[0]] },
        { _id: "opt_2", startDate: dayjs().add(3, 'day').toISOString(), endDate: dayjs().add(3, 'day').toISOString(), selectedBy: [MOCK_USERS[0], MOCK_USERS[1]] },
        { _id: "opt_3", startDate: dayjs().add(4, 'day').toISOString(), endDate: dayjs().add(4, 'day').toISOString(), selectedBy: [] },
    ]
};

export default function CalendarDetailsPage() {
    const { id, calendarId } = useLocalSearchParams<{ id: string, calendarId: string }>();
    const insets = useSafeAreaInsets();
    
    const me = MOCK_ME;
    const [calendarData, setCalendarData] = useState<any>(INITIAL_CALENDAR);

    // Fonction qui permet de s'ajouter / se retirer à volonté
    const handleToggleDay = (dayJsObj: any) => {
        setCalendarData((prev: any) => {
            const newOptions = [...prev.options];
            const targetDateStr = dayJsObj.format('YYYY-MM-DD');
            const optIndex = newOptions.findIndex(opt => dayjs(opt.startDate).format('YYYY-MM-DD') === targetDateStr);

            if (optIndex !== -1) {
                const opt = { ...newOptions[optIndex] };
                const hasVoted = opt.selectedBy.some((u: any) => u._id === me._id);
                
                if (hasVoted) {
                    opt.selectedBy = opt.selectedBy.filter((u: any) => u._id !== me._id);
                } else {
                    opt.selectedBy = [...opt.selectedBy, me];
                }
                newOptions[optIndex] = opt;
            }

            return { ...prev, options: newOptions };
        });
    };

    return (
        <Animated.ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom }} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ headerRight: () => null, title: "Disponibilités" }} />

            <View className="m-2 mb-4 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 pb-0 overflow-hidden">
                <View className="p-4 pb-0">
                    <View className="flex-row items-center gap-2 mb-4">
                        <Avatar src={calendarData.createdBy?.avatar} alt={calendarData.createdBy?.name?.charAt(0)} size2="sm" />
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">{calendarData.createdBy?.name}</Text>
                        </View>
                    </View>
                    <View className="mb-4">
                        <Text className="text-2xl font-bold dark:text-white">{calendarData.question}</Text>
                    </View>
                </View>

                {/* Composant Calendrier avec vote interactif */}
                <SharedCalendar poll={calendarData} me={me} onToggleDay={handleToggleDay} />
            </View>
        </Animated.ScrollView>
    );
}