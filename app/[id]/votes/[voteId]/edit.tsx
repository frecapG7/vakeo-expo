import { Button } from "@/components/ui/Button";
import { DatesVoteForm } from "@/components/votes/dates/DatesVoteForm";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetVote } from "@/hooks/api/useVotes";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TripVoteEditPage() {



    const { id, voteId } = useLocalSearchParams();
    const { data: vote } = useGetVote(id, voteId);

    const { control, reset, handleSubmit } = useForm();

    const { me } = useContext(TripContext);



    useEffect(() => {
        reset(vote);
    }, [vote]);

    const navigation = useNavigation();
    const onSubmit = async (data) => {
        console.log(JSON.stringify(data, null, 2));
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <Button className="flex"
                    onPress={handleSubmit(onSubmit)}>
                    <Text className="text-lg dark:text-white">
                        Ajouter
                    </Text>
                </Button>
        })
    }, [navigation])

    return (
        <SafeAreaView style={styles.container}>
            {vote?.type === "DATES" &&
                <Animated.View entering={ZoomIn} style={{ flex: 1 }}>
                    <DatesVoteForm control={control} user={me} />
                </Animated.View>
            }

        </SafeAreaView>
    )

}