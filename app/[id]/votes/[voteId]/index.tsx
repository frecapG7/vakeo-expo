import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { DatesVoteDetails } from "@/components/votes/dates/DatesVoteDetails";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useCloseVote, useGetVote, usePutVote } from "@/hooks/api/useVotes";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { getTypeLabel } from "@/lib/voteUtils";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";





export default function TripVoteDetailsPage() {


    const { id, voteId } = useLocalSearchParams();

    const { data: trip } = useGetTrip(id);
    const { data: vote } = useGetVote(id, voteId);
    const updateVote = usePutVote(id, voteId);
    const closeVote = useCloseVote(id, voteId);

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
            <View className="flex-row justify-between items-center px-10 mb-5">
                <View className="items-center">
                    <Text className="text-xl uppercase dark:text-white">{vote?.status === "OPEN" ? "en cours" : "terminé"}</Text>
                    <Text className="text-sm dark:text-gray-400">Depuis {formatDuration(vote?.createdAt, new Date())}</Text>
                </View>

                {/* {vote?.status !== "CLOSED" && */}
                <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                    <Button variant="contained"
                        className="flex-row gap-1 items-center p-2"
                        onPress={() => router.navigate({
                            pathname: "/[id]/votes/[voteId]/edit",
                            params: {
                                id,
                                voteId
                            }
                        })}>
                        <IconSymbol name="calendar" color="white" />
                        <Text className="text-white">Ouvrir le calendrier</Text>
                    </Button>
                </Animated.View>
            </View>



            {vote?.type === "DATES" &&
                <Animated.View entering={ZoomIn} className="gap-5 my-2">
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
                                onPress={async () => {
                                    await closeVote.mutateAsync(me?._id)
                                }}
                                isLoading={closeVote.isPending}
                            />
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