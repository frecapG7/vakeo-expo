import { Button } from "@/components/ui/Button";
import { DatesVoteForm } from "@/components/votes/dates/DatesVoteForm";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetVote, usePutVote } from "@/hooks/api/useVotes";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";


export default function TripVoteEditPage() {



    const { id, voteId, disabled } = useLocalSearchParams();
    const { data: vote } = useGetVote(id, voteId);
    const updateVote = usePutVote(id, voteId);

    const router = useRouter();
    const { control, reset, handleSubmit } = useForm();

    const { me } = useContext(TripContext);

    useEffect(() => {
        reset(vote);
    }, [vote]);

    const navigation = useNavigation();
    const onSubmit = async (data) => {
        await updateVote.mutateAsync(data);
        Toast.success("Date ajoutés");

        router.dismissTo({
            pathname: "/[id]/votes/[voteId]",
            params: {
                id,
                voteId
            }
        });
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
                    <DatesVoteForm control={control} user={me} disabled={Boolean(disabled)} />
                </Animated.View>
            }

        </SafeAreaView>
    )

}