import { VoteListItem } from "@/components/votes/VoteListItem";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetVotes } from "@/hooks/api/useVotes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TripVotesPage() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const { data: page } = useGetVotes(id);


    const router = useRouter();

    const { me } = useContext(TripContext);




    return (
        <SafeAreaView style={styles.container}>

            <Animated.FlatList data={page?.votes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) =>
                    <VoteListItem vote={item}
                        trip={trip}
                        user={me}
                        onClick={() =>
                            router.push({
                                pathname: "/[id]/votes/[voteId]",
                                params: {
                                    id: trip._id,
                                    voteId: item._id
                                }
                            })} />
                }
                contentContainerClassName='gap-5' />
        </SafeAreaView>
    )
}