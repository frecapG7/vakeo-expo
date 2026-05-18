import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { FlatList, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripAttendees() {
    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const router = useRouter();


    const { me } = useContext(TripContext);

    if (!trip) {
        return (
            <View className="flex m-4 gap-4">
                <View className="gap-4">
                    <View className="w-[60%]">
                        <Skeleton height={10}/>
                    </View>
                </View>
                <View className="mx-4 gap-2">
                    <Skeleton height={14} />
                    <Skeleton height={14} />
                    <Skeleton height={14} />
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} className="m-5">
            <FlatList
                ListHeaderComponent={() =>
                    <View className="gap-4">
                        <View className="">
                            <Text className="text-xl font-bold mb-4 dark:text-white">
                                Niveau d&apos;accessibilité: {trip.isPrivate ? 'Privé 🔒' : 'Public 🌐'}
                            </Text>
                        </View>

                        <View className="">
                            <Text className="text-lg font-semibold mb-2 dark:text-white">
                                Participants ({trip.users?.length || 0})
                            </Text>
                        </View>
                    </View>}
                data={trip.users}
                keyExtractor={(item, index) => item._id?.toString() || index.toString()}
                renderItem={({ item }) => (
                    <View
                        className="flex-row p-2 rounded-xl gap-2 p-2 items-center bg-white dark:bg-gray-900 border border-orange-200 dark:border-gray-600" >
                        <Avatar size2="sm"
                            alt={item.name.charAt(0)}
                            src={item?.avatar} />
                        <View className="flex-1 flex-row justify-between items-center">
                            <Text className="text-md dark:text-white">
                                {item.name}
                            </Text>
                            {item?._id === me?._id &&
                                <Animated.View>
                                    <Chip variant="contained" text="Moi" size="small" />
                                </Animated.View>
                            }
                        </View>
                    </View>
                )}
                contentContainerClassName="gap-2"
                ListFooterComponent={() => <View className="m-5 mt-auto">
                    <Button
                        variant="contained"
                        title="Modifier les participants"
                        onPress={() => router.push({
                            pathname: "/[id]/attendees/edit",
                            params: {
                                id: String(id)
                            }
                        })}
                    />
                </View>}
            />


        </SafeAreaView>
    );
}