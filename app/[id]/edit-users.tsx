import { TripUsersForm } from "@/components/trips/TripUsersForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip, useUpdateTrip } from "@/hooks/api/useTrips";
import { Trip } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

export default function EditTripUsers() {

    const { id } = useLocalSearchParams();

    const { me } = useContext(TripContext);

    const { data: trip } = useGetTrip(id);
    const updateTrip = useUpdateTrip(id);

    const { control,
        handleSubmit,
        reset,
        formState: { isDirty } } = useForm<Trip>();

    useEffect(() => {
        reset(trip);
    }, [trip, reset]);

    const users = useWatch({
        control,
        name: "users"
    });
    const selected = users?.map(u => u?._id).indexOf(me?._id);


    const router = useRouter();
    const onSubmit = async (data: Trip) => {
        await updateTrip.mutateAsync(data);
        router.back();
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding">
            <Animated.ScrollView className="py-10">
                <Text className="font-bold text-2xl dark:text-white" >
                    Accès et utilisateurs
                </Text>
                <View className="m-5">
                    <TripUsersForm control={control} selected={selected} />
                </View>
                {isDirty &&
                    <Animated.View
                        entering={ZoomIn}
                        className="m-5">
                        <Button
                            variant="contained"
                            size="medium"
                            title="Modifier"
                            isLoading={updateTrip?.isPending}
                            onPress={handleSubmit(onSubmit)} />
                    </Animated.View>
                }
            </Animated.ScrollView>
        </KeyboardAvoidingView >
    )

}






