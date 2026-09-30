import { TripUsersForm } from "@/components/trips/TripUsersForm";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import styles from "@/constants/Styles";
import { usePostTrip } from "@/hooks/api/useTrips";
import { useAddStorageTrip } from "@/hooks/storage/useStorageTrips";
import { Trip } from "@/types/models";
import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function NewTripUsers() {


    const { control, handleSubmit } = useFormContext<Trip>();

    const addStorageTrip = useAddStorageTrip();
    const postTrip = usePostTrip();

    const router = useRouter();

    const onSubmit = async (data: any) => {
        const result = await postTrip.mutateAsync(data);
        // v3 : stockage lean — encodedId + credentials du créateur.
        // name/image ne sont plus stockés : l'affichage vit sur l'hydrate batch (POST /v3/trips/batch).
        await addStorageTrip.mutateAsync({
            _id: result.encodedId,
            user: result.credentials._id,
            token: result.credentials.token
        });
        router.dismissTo({
            pathname: "/[id]/(tabs)",
            params: {
                id: result.encodedId
            }
        })
    };



    return (
        <Screen style={styles.container}>
            <KeyboardAvoidingView behavior="padding"
                keyboardVerticalOffset={64}
                style={styles.container}>
                <Animated.ScrollView className="flex-1 my-5">
                    <View className="m-2">
                        <Text className="text-h1 text-night dark:text-white">
                            Choisis comment partager avec tes amis
                        </Text>
                        <Text className="text-sm text-night/70 dark:text-white/60">
                            Décide de comment tes amis peuvent accéder à ton projet.
                        </Text>

                    </View>
                    <View className="m-5">
                        <TripUsersForm control={control} selected={0} />
                    </View>

                    <View>
                        <Button variant="contained"
                            title="Suivant"
                            onPress={handleSubmit(onSubmit)}
                            isLoading={postTrip.isPending}>
                        </Button>
                    </View>
                </Animated.ScrollView>

            </KeyboardAvoidingView>
        </Screen>
    )
}
