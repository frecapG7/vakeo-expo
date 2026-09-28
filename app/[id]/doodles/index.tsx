import SharedCalendar from "@/components/polls/SharedCalendar";
import { Avatar } from "@/components/ui/Avatar";
import styles from "@/constants/Styles";
import dayjs from "@/lib/dayjs-config";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================================================
// MOCKS (En attendant l'API de ton collègue)
// ============================================================
const MOCK_ME = { _id: "u_me", name: "Moi", avatar: null };
const MOCK_USERS = [
    { _id: "u1", name: "Thomas", avatar: null },
    { _id: "u2", name: "Marie", avatar: null }
];

const INITIAL_DOODLE = {
    _id: "mock_doodle_123",
    type: "Doodle",
    question: "Quand êtes-vous disponibles ?",
    createdBy: MOCK_USERS[0],
    isAnonymous: false,
    isClosed: false,
    options: [
        // Le 10 a un vote (Thomas)
        { _id: "opt_1", startDate: dayjs().add(2, 'day').toISOString(), endDate: dayjs().add(2, 'day').toISOString(), selectedBy: [MOCK_USERS[0]] },
        // Le 11 a deux votes (Thomas et Marie)
        { _id: "opt_2", startDate: dayjs().add(3, 'day').toISOString(), endDate: dayjs().add(3, 'day').toISOString(), selectedBy: [MOCK_USERS[0], MOCK_USERS[1]] },
        // Le 12 n'a pas encore de vote
        { _id: "opt_3", startDate: dayjs().add(4, 'day').toISOString(), endDate: dayjs().add(4, 'day').toISOString(), selectedBy: [] },
    ]
};

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function DoodleDetailsPage() {
    const { id, doodleId } = useLocalSearchParams<{ id: string, doodleId: string }>();
    const insets = useSafeAreaInsets();
    
    // Remplacer ces deux variables par les hooks de contexte/API plus tard :
    // const { me } = useContext(TripContext);
    // const { data: doodle } = useGetDoodle(id, doodleId);
    
    const me = MOCK_ME;
    const [doodle, setDoodle] = useState<any>(INITIAL_DOODLE);

    // Fonction de mock pour simuler un vote sur le calendrier
    const handleToggleDay = (dayJsObj: any) => {
        setDoodle((prev: any) => {
            const newOptions = [...prev.options];
            const targetDateStr = dayJsObj.format('YYYY-MM-DD');
            const optIndex = newOptions.findIndex(opt => dayjs(opt.startDate).format('YYYY-MM-DD') === targetDateStr);

            // On ne peut voter que sur les jours proposés par le créateur
            if (optIndex !== -1) {
                const opt = { ...newOptions[optIndex] };
                const hasVoted = opt.selectedBy.some((u: any) => u._id === me._id);
                
                if (hasVoted) {
                    opt.selectedBy = opt.selectedBy.filter((u: any) => u._id !== me._id); // Retire le vote
                } else {
                    opt.selectedBy = [...opt.selectedBy, me]; // Ajoute le vote
                }
                newOptions[optIndex] = opt;
            } else {
                console.log("Ce jour n'est pas proposé dans le Doodle.");
            }

            return { ...prev, options: newOptions };
        });
    };

    return (
        <Animated.ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom }} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ headerRight: () => null, title: "Détail du Doodle" }} />

            <View className="m-2 mb-4 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 pb-0 overflow-hidden">
                
                <View className="p-4 pb-0">
                    <View className="flex-row items-center gap-2 mb-4">
                        <Avatar src={doodle.createdBy?.avatar} alt={doodle.createdBy?.name?.charAt(0)} size2="sm" />
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">{doodle.createdBy?.name}</Text>
                        </View>
                    </View>
                    <View className="mb-4">
                        <Text className="text-2xl font-bold dark:text-white">{doodle.question}</Text>
                    </View>
                </View>

                {/* NOTRE COMPOSANT CALENDRIER NATIVEMENT INTÉGRÉ */}
                <SharedCalendar poll={doodle} me={me} onToggleDay={handleToggleDay} />

            </View>
        </Animated.ScrollView>
    );
}