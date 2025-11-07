import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { Button } from "@/components/ui/Button";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { DatesVoteDetails } from "@/components/votes/dates/DatesVoteDetails";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetVote, usePutVote } from "@/hooks/api/useVotes";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { getTypeLabel } from "@/lib/voteUtils";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";





export default function TripVoteDetailsPage() {


    const { id, voteId } = useLocalSearchParams();

    const { data: trip } = useGetTrip(id);
    const { data: vote } = useGetVote(id, voteId);
    const updateVote = usePutVote(id, voteId);

    const { formatDuration } = useI18nTime();

    const { me } = useContext(TripContext);


    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: getTypeLabel(vote?.type)
        });
    }, [vote]);

    const [openVoters, setOpenVoter] = useState(false);

    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View className="flex-row justify-around items-center">
                <Button className=""
                    onPress={() => router.navigate({
                        pathname: "/[id]/votes/[voteId]/edit",
                        params: {
                            id,
                            voteId
                        }
                    })}>
                    <CalendarDayView>
                        <Text className="text-sm py-5 px-1 text-center w-30"
                            numberOfLines={2}>Ouvrir le calendrier</Text>
                    </CalendarDayView>
                </Button>
                <View className="items-center">
                    <Text className="text-xl uppercase dark:text-white">{vote?.status === "OPEN" ? "en cours" : "terminé"}</Text>
                    <Text className="text-sm dark:text-gray-400">Depuis {formatDuration(vote?.createdAt, new Date())}</Text>
                </View>
            </View>



            {vote?.type === "DATES" &&
                <Animated.View entering={ZoomIn} className="gap-5 my-2">
                    {/* <View className="items-end px-5 mt-5">
                        
                    </View> */}
                    <View className="px-2">
                        <DatesVoteDetails vote={vote}
                            me={me}
                            onVote={async (id) => {
                                const result = {
                                    ...vote,
                                    votes: vote.votes.map((v) => {
                                        if (v._id !== id)
                                            return v;
                                        const newUsers = v.users;
                                        newUsers.push(me);
                                        return ({
                                            ...v,
                                            users: newUsers
                                        });
                                    })
                                }
                                await updateVote.mutateAsync(result);

                            }}
                            onUnVote={async (id) => {
                                const result = {
                                    ...vote,
                                    votes: vote.votes.map((v) => {
                                        if (v._id !== id)
                                            return v;
                                        const newUsers = v.users.filter(u => u._id !== me._id);
                                        return ({
                                            ...v,
                                            users: newUsers
                                        });
                                    })
                                }
                                await updateVote.mutateAsync(result);
                            }}
                        />
                    </View>
                    {(vote?.status === "OPEN" && vote?.createdBy._id === me?._id) &&
                        <View className="my-10 px-10">
                            <Button variant="contained"
                                className="bg-red-400"
                                title="Terminer le vote"
                                onPress={() => console.log("todo")} />
                        </View>
                    }
                </Animated.View>

            }


            <PickUsersModal open={openVoters}
                onClose={() => setOpenVoter(false)}
                users={trip?.users.map((u) => ({
                    ...u,
                    checked: vote?.voters.map(u => u._id).includes(u._id)
                }))}
                disabled
            />

        </SafeAreaView>
    )
}