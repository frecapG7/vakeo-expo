import { RestrictionIcon } from "@/components/users/RestrictionIcon";
import { default as styles } from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { translateRestriction } from "@/lib/userUtils";
import { router } from "expo-router";
import { useContext, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripRestrictions() {

    const { trip, me } = useContext(TripContext);

    // Get all users with their restrictions
    const users = useMemo(() => trip?.users || [], [trip?.users]);

    const {restrictionsByType, totalRestrictions } = useMemo(() => {
        const result: Record<string, typeof users> = {};
        let total = 0 ;
        users.forEach(u => {
            (u.restrictions || []).forEach(r => {
                if (!result[r]) result[r] = [];
                result[r].push(u);
                total++;
            });
        });
        return {restrictionsByType: result, totalRestrictions: total};
    }, [users]);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.ScrollView style={styles.container}>
                {/* Header */}
                <View className="flex-row justify-between items-center mx-5 my-4">
                    <View className="flex-1">
                        <Text className="text-2xl font-bold dark:text-white">Restrictions alimentaires</Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-sm">
                            {totalRestrictions} restriction{totalRestrictions !== 1 ? "s" : ""} au total
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => router.back()}
                        className="p-2 justify-center items-center"
                    >
                        <Text className="text-blue-500 text-lg font-bold">Terminé</Text>
                    </Pressable>
                </View>

                {/* Restrictions List */}
                <View className="mx-4 gap-4">
                    {Object.entries(restrictionsByType).map(([type,usersWithRestriction]) => {
                        return (
                            <View
                                key={type}
                                className={`flex-row items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700`}
                            >
                                <RestrictionIcon value={type} size="sm2" />
                                <View className="flex-1">
                                    <Text className="text-lg font-bold dark:text-white capitalize">
                                        {translateRestriction(type)}
                                    </Text>
                                        <Text className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                            {usersWithRestriction.map(u => u.name).join(", ")}
                                        </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <View className={`w-8 h-8 rounded-full items-center justify-center bg-orange-100 dark:bg-orange-900/30`}>
                                        <Text className={`text-sm font-bold text-orange-600 dark:text-orange-400`}>
                                            {usersWithRestriction.length}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Empty state */}
                {totalRestrictions === 0 && (
                    <View className="flex-1 items-center justify-center gap-6 py-20 px-4">
                        <Text className="text-3xl font-bold dark:text-white">
                            Aucune restriction
                        </Text>
                        <Text className="text-gray-400 dark:text-gray-500 text-center max-w-sm">
                            Aucune restriction alimentaire pour ce voyage
                        </Text>
                    </View>
                )}
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
