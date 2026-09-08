import { TripUsersForm } from "@/components/trips/TripUsersForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useUpdateTrip } from "@/hooks/api/useTrips";
import { Trip } from "@/types/models";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { KeyboardAvoidingView, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditAttendees() {

    const { me, trip } = useContext(TripContext);

    const updateTrip = useUpdateTrip(trip?._id);

    const { control,
        handleSubmit,
        reset } = useForm<Trip>();

    useEffect(() => {
        reset(trip);
    }, [trip, reset]);

    const users = useWatch({
        control,
        name: "users"
    });
    const selected = me ? users?.map(u => u?._id).indexOf(me?._id) : -1;


    const router = useRouter();
    const onSubmit = async (data: Trip) => {
        await updateTrip.mutateAsync(data);
        router.back();
    }

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding">
                <Animated.ScrollView className="" contentInsetAdjustmentBehavior="automatic">
                    <View className="mx-2">
                        <TripUsersForm control={control} selected={selected} />
                    </View>
                    <Animated.View
                        entering={ZoomIn}
                        className="m-5 mt-auto">
                        <Button
                            variant="contained"
                            size="medium"
                            title="Modifier"
                            isLoading={updateTrip?.isPending}
                            onPress={handleSubmit(onSubmit)} />
                    </Animated.View>
                </Animated.ScrollView>
            </KeyboardAvoidingView >
        </SafeAreaView>
    )
}