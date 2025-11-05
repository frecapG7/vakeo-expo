import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LinearProgress } from "@/components/ui/LinearProgress";
import styles from "@/constants/Styles";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetVotes } from "@/hooks/api/useVotes";
import { getTypeLabel } from "@/lib/voteUtils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TripVotesPage() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const { data: page } = useGetVotes(id);


    const router = useRouter();




    return (
        <SafeAreaView style={styles.container}>


            <Text className="text-white">Votes {page?.totalResults}</Text>

            <Animated.FlatList data={page?.votes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    return (
                        <View className="gap-1">
                            <View className="flex-row justify-between px-2">
                                <Text className="text-xl dark:text-white">{getTypeLabel(item.type)}</Text>
                                <View>
                                    <Text>{item.status}</Text>
                                </View>
                            </View>
                            <View className="bg-orange-400 rounded-lg p-2 gap-2">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center ">
                                        {item.voters.map((v, index) =>
                                            <View key={v._id}
                                                className={`flex ${index > 0 && "-ml-2.5"}`}>
                                                <Avatar src={v.avatar}
                                                    size2="sm" alt={v.name?.charAt(0)}
                                                />
                                            </View>)}
                                    </View>
                                    <View className="flex-row items-center">
                                        <IconSymbol name="person" size={20} color="black" />
                                        <Text className="font-bold text-lg">{item.voters.length}</Text>
                                    </View>
                                </View>
                                <LinearProgress progress={item.voters.length / trip?.users.length} />

                                <View className="px-10">
                                    <Button
                                        className="px-10"
                                        variant="contained"
                                        title="Voir"
                                        onPress={() => router.push({
                                            pathname: "/[id]/votes/[voteId]",
                                            params: {
                                                id,
                                                voteId: item._id
                                            }
                                        })}
                                    />
                                </View>

                            </View>



                        </View>
                    )
                }}
                contentContainerClassName='gap-5' />
        </SafeAreaView>
    )
}