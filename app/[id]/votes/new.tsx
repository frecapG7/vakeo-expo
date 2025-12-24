import { Button } from "@/components/ui/Button";
import { DatesVoteForm } from "@/components/votes/dates/DatesVoteForm";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { usePostVote } from "@/hooks/api/useVotes";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";


export default function NewVotePage() {


    const { id, type } = useLocalSearchParams();
    const { me } = useContext(TripContext);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            type: "",
            createdBy: {},
            votes: []
        }
    });
    const navigation = useNavigation();


    const router = useRouter();
    const postVote = usePostVote(id);

    const onSubmit = async (data) => {
        if (data?.votes?.length === 0) {
            Toast.warn("STP frangin choisit au moins une date")
            return;
        }
        const vote = await postVote.mutateAsync(data);
        Toast.success("Vote créé avec succès");
        router.dismissTo({
            pathname: "/[id]/votes/[voteId]",
            params: {
                id,
                voteId: vote._id
            }
        });
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <Button className="flex"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={postVote?.isPending}>
                    <Text className="text-lg dark:text-white">
                        Ajouter
                    </Text>
                </Button>
        })
    }, [navigation]);



    useEffect(() => {
        reset({
            type,
            createdBy: me,
            votes: []
        });
    }, [type, me]);

    return (
        <SafeAreaView style={styles.container}>
            {type === "DATES" &&
                <Animated.View entering={FadeIn}>
                    <DatesVoteForm control={control} user={me} />
                </Animated.View>
            }
        </SafeAreaView>
    )
}