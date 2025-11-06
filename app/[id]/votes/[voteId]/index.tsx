import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { DatesVoteDetails } from "@/components/votes/dates/DatesVoteDetails";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetVote, usePutVote } from "@/hooks/api/useVotes";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { getTypeLabel } from "@/lib/voteUtils";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
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

    return (
        <SafeAreaView style={styles.container}>
            <View className="flex-row justify-around items-center">

                <Button className="items-center" onPress={() => setOpenVoter(true)}>
                    <Text className="text-sm dark:text-white">Votant</Text>
                    <View className="flex-row items-center">
                        {vote?.voters.slice(0, 3).map(((u, index) =>
                            <View key={u._id} className={`${index > 0 && "-ml-7"}`}>
                                <Avatar src={u.avatar} alt={u?.name?.charAt(0)} size2="md" />
                            </View>
                        ))}
                        {vote?.voters.length > 3 &&
                            <View key="++" className="-ml-7">
                                <Avatar alt={`+${vote?.voters.length - 3}`} size2="md" />
                            </View>
                        }
                    </View>
                    <Text numberOfLines={1} className="max-w-50 dark:text-white" >
                        {vote?.voters.map((u, index) => u.name).join(", ")}
                    </Text>
                </Button>

                <View className="items-center">
                    <Text className="text-xl uppercase dark:text-white">{vote?.status === "OPEN" ? "en cours" : "terminé"}</Text>
                    <Text className="text-sm dark:text-gray-400">Depuis {formatDuration(vote?.createdAt, new Date())}</Text>
                </View>
            </View>



            {vote?.type === "DATES" &&
                <Animated.View entering={ZoomIn} className="gap-5 my-2">
                    <View className="items-end px-5 mt-5">
                        <Button className=""
                            onPress={() => router.navigate({
                                pathname: "/[id]/votes/[voteId]/edit",
                                params: {
                                    id,
                                    voteId
                                }
                            })}>
                            <CalendarDayView>
                                <Text className="text-sm dark:text-white py-5 px-1 text-center w-30" 
                                numberOfLines={2}>Ouvrir le calendrier</Text>
                            </CalendarDayView>
                        </Button>
                    </View>
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