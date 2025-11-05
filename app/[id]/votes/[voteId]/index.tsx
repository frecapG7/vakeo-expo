import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { DatesVoteDetails } from "@/components/votes/dates/DatesVoteDetails";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetVote } from "@/hooks/api/useVotes";
import useI18nNumbers from "@/hooks/i18n/useI18nNumbers";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import { getTypeLabel } from "@/lib/voteUtils";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";





export default function TripVoteDetailsPage() {


    const { id, voteId } = useLocalSearchParams();

    const { data: trip } = useGetTrip(id);
    const { data: vote } = useGetVote(id, voteId);

    const { formatDate, formatRange, formatDuration } = useI18nTime();
    const { formatPercent } = useI18nNumbers();

    const { me } = useContext(TripContext);
    const colors = useColors();


    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: getTypeLabel(vote?.type)
        });
    }, [vote]);

    return (
        <SafeAreaView style={styles.container}>
            <View className="flex-row justify-between items-center">

                <View className="items-center">
                    <View className="flex-row items-center">
                        {vote?.voters.map(((u, index) =>
                            <View key={u._id} className={`${index > 0 && "-ml-7"}`}>
                                <Avatar src={u.avatar} alt={u?.name.charAt(0)} size2="md" />
                            </View>
                        ))}
                    </View>
                    <Text numberOfLines={1} className="max-w-50 dark:text-white" >
                        {vote?.voters.map((u, index) => u.name).join(", ")}
                    </Text>
                </View>

                <View className="items-center">
                    <Text className="text-xl uppercase dark:text-white">{vote?.status === "OPEN" ? "en cours" : "terminé"}</Text>
                    <Text className="text-sm dark:text-gray-400">Depuis {formatDuration(vote?.createdAt, new Date())}</Text>
                </View>
            </View>



            {vote?.type === "DATES" &&
                <Animated.View entering={ZoomIn}>
                    <DatesVoteDetails vote={vote} me={me} />
                    {vote?.status === "OPEN" &&
                        <View className="my-10 px-10">
                            <Button variant="contained"
                                title="Ajouter des dates"
                                onPress={() => router.navigate({
                                    pathname: "/[id]/votes/[voteId]/edit",
                                    params: {
                                        id,
                                        voteId
                                    }
                                })} />
                        </View>
                    }
                </Animated.View>

            }


        </SafeAreaView>
    )
}