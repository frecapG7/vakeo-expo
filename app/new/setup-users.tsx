import { TripUsersForm } from "@/components/trips/TripUsersForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { usePostTrip } from "@/hooks/api/useTrips";
import { useAddStorageTrip } from "@/hooks/storage/useStorageTrips";
import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function NewTripUsers() {


    const { control, handleSubmit } = useFormContext();

    const navigation = useNavigation();

    const addStorageTrip = useAddStorageTrip();
    const postTrip = usePostTrip();

    const router = useRouter();

    const onSubmit = async (data: any) => {
        const result = await postTrip.mutateAsync(data);
        await addStorageTrip.mutateAsync({
            _id: result._id,
            name: result.name,
            image: result.image,
            user: result.users[0]
        });
        router.replace(`./${result._id}`);
    };


    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <Button variant="contained"
                    size="small"
                    title="Suivant"
                    onPress={handleSubmit(onSubmit)}>
                </Button>
        })
    }, [navigation, onSubmit]);

    return (
        <KeyboardAvoidingView behavior="padding"
            keyboardVerticalOffset={64}
            style={styles.container}>
            <Animated.ScrollView className="flex-1 my-5">
                <View className="m-2">
                    <Text className="text-2xl font-bold dark:text-white">
                        Choisis comment partager avec tes amis
                    </Text>
                    <Text className="text-md dark:text-gray-200">
                        Décide de comment tes amis peuvent accéder à ton projet.
                    </Text>
                  
                </View>
                <View className="m-5">
                    <TripUsersForm control={control} selected={0} />
                </View>
            </Animated.ScrollView>

        </KeyboardAvoidingView>
    )
}