import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { LinearProgress } from "@/components/ui/LinearProgress";
import styles from "@/constants/Styles";
import { useGetVotes } from "@/hooks/api/useVotes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


const getTitle = (value: string) => {
    if (value === "DATES")
        return "Vote des dates du séjour";
    return "Vote de type inconnu"
}


export default function TripVotesPage() {


    const { id } = useLocalSearchParams();
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
                                <Text className="text-xl dark:text-white">{getTitle(item.type)}</Text>
                                <View>
                                    <Avatar size2="sm" src={item.createdBy?.avatar} alt={item.createdBy?.name.charAt(0)} />
                                </View>
                            </View>
                            <View className="bg-orange-200 rounded-lg p-2 gap-2">
                                <LinearProgress progress={0.50} />
                                <Button variant="contained"
                                    title="Je vote"
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
                    )
                }}
                contentContainerClassName='gap-5' />
        </SafeAreaView>
    )
}