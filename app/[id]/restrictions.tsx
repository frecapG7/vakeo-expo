import { RestrictionIcon } from "@/components/users/RestrictionIcon";
import { useTrip } from "@/context/TripContext";
import { translateRestriction } from "@/lib/userUtils";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripRestrictions() {

    const { trip } = useTrip();

    // Get all users with their restrictions
    const users = useMemo(() => trip?.users || [], [trip?.users]);

    const {restrictionsByType, totalRestrictions } = useMemo(() => {
        const result: Record<string, typeof users> = Object.create(null);
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
        <SafeAreaView className="flex-1 bg-mist dark:bg-ink">
            <Animated.ScrollView>
                {/* Header */}
                <View className="flex-row justify-between items-center mx-4 my-4">
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-night dark:text-white">Restrictions alimentaires</Text>
                        <Text className="text-night/50 dark:text-white/50 text-sm">
                            {totalRestrictions} restriction{totalRestrictions !== 1 ? "s" : ""} au total
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => router.back()}
                        className="p-2 justify-center items-center"
                    >
                        <Text className="text-amber-deep dark:text-amber text-lg font-bold">Terminé</Text>
                    </Pressable>
                </View>

                {/* Restrictions List */}
                <View className="mx-4 gap-4">
                    {Object.entries(restrictionsByType).map(([type,usersWithRestriction]) => {
                        return (
                            <View
                                key={type}
                                className="flex-row items-center gap-4 p-4 rounded-2xl bg-white dark:bg-night shadow-sm border border-mist dark:border-white/10"
                            >
                                <RestrictionIcon value={type} size="sm2" />
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-night dark:text-white capitalize">
                                        {translateRestriction(type)}
                                    </Text>
                                        <Text className="text-night/60 dark:text-white/60 text-sm mt-1">
                                            {usersWithRestriction.map(u => u.name).join(", ")}
                                        </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded-full items-center justify-center bg-amber/15 dark:bg-amber/20">
                                        <Text className="text-sm font-bold text-amber-deep dark:text-amber">
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
                        <Text className="text-3xl font-bold text-night dark:text-white">
                            Aucune restriction
                        </Text>
                        <Text className="text-night/50 dark:text-white/50 text-center max-w-sm">
                            Aucune restriction alimentaire pour ce voyage
                        </Text>
                    </View>
                )}
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
