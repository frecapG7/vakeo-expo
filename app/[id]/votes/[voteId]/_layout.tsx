import { useGetVote } from "@/hooks/api/useVotes";
import { getTypeLabel } from "@/lib/voteUtils";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";


export default function VoteDetailsLayout() {


    const { id, voteId } = useLocalSearchParams();

    const { data: vote } = useGetVote(id, voteId);


    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: vote ? getTypeLabel(vote.type) : ""
        })
    }, [navigation, vote]);

    return (
        <Stack screenOptions={{
            title: "Quelles dates?",
        }}>
            <Stack.Screen name="index" options={{
                headerShown: false
            }}/>
            <Stack.Screen name="edit" options={{
                presentation: "modal",
                title: "Modifier",
                headerBackTitle: "Annuler"
                
            }} />
        </Stack>
    )

}