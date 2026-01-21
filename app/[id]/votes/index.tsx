import { IconSymbol } from "@/components/ui/IconSymbol";
import { VoteListItem } from "@/components/votes/VoteListItem";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetVotes } from "@/hooks/api/useVotes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable } from "react-native";
import Animated from "react-native-reanimated";


export default function TripVotesPage() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const { data: page } = useGetVotes(id);


    const router = useRouter();

    const { me } = useContext(TripContext);




    return (
        <Animated.View style={styles.container}>
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

            <Pressable className="absolute bottom-12 right-6 w-20 h-20 rounded-full bg-blue-400 items-center justify-center"
                onPress={() => router.push({
                    pathname: "/[id]/votes/new",
                    params: {
                        id: String(id)
                    }
                })}>
                <IconSymbol name="plus" color="white" size={40} />
            </Pressable>
        </Animated.View>
    )
}