import { Button } from "@/components/ui/Button";
import { LinearProgress } from "@/components/ui/LinearProgress";
import styles from "@/constants/Styles";
import { useGetVote } from "@/hooks/api/useVotes";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const getPercent = (value: number, total : number) => {

    const t = total || 1;
    return value / t;

}



export default function TripVoteDetailsPage() {


    const { id, voteId } = useLocalSearchParams();
    const { data: vote } = useGetVote(id, voteId);

    const { formatDate, formatRange , formatDuration} = useI18nTime();

    return (
        <SafeAreaView style={styles.container}>


            <View>
                <View>
                    <Text className="uppercase">ouvert</Text>
                </View>

                <Text>{formatDuration(vote?.createdAt, new Date())}</Text>
            </View>


            <View className="gap-5">
                {vote?.votes?.map((v) => {
                    const percent = getPercent(v.users.length, vote.voters.length);
                    return (
                        <View className="gap-1" key={v._id}>
                            <View className="flex-row items-end justify-between px-2">
                                <Text className="text-xl dark:text-white">{formatDate(v.startDate)} - {formatDate(v.endDate)}</Text>
                                {/* <Text className="text-xl dark:text-white">{formatRange(v.startDate, v.endDate)}</Text> */}
                                <View className="rounded-full p-2 bg-gray-200">
                                    <Text className="font-bold">{percent * 100} %</Text>
                                </View>
                            </View>

                            <View className="flex-row">
                                <LinearProgress progress={getPercent(v.users?.length, vote.voters.length)} />
                                {/* <Button variant="contained" title="Voter" /> */}
                            </View>
                        </View>

                    )
                }
                )}

            </View>


            {vote?.status === "OPEN" &&
                <View className="my-10">
                    <Button variant="contained" title="Terminer" onPress={() => console.log("TODO")} />
                </View>
            }
        </SafeAreaView>
    )
}