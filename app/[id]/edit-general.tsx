import { TripInfoForm } from "@/components/trips/TripInfoForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { useGetTrip, useUpdateTrip } from "@/hooks/api/useTrips";
import { Trip } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";



export default function EditTripGeneral() {



    const { id } = useLocalSearchParams();

    const { data: trip } = useGetTrip(id);
    const updateTrip = useUpdateTrip(id);


    const { control, reset, handleSubmit, formState: { isDirty } } = useForm<Trip>();

    const router = useRouter();

    useEffect(() => {
        reset(trip);
    }, [reset, trip]);



    const onSubmit = async (data: Trip) => {
        await updateTrip.mutateAsync(data);
        Toast.success("Voyage modifié");
        router.dismissTo({
            pathname: "/[id]/(tabs)",
            params: {
                id: String(id)
            }
        })
    }





    return (
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView>
                <View className="mx-2">
                    <TripInfoForm control={control} />
                </View>

                {isDirty &&
                    <Animated.View
                        entering={ZoomIn}
                        className="m-5">
                        <Button
                            variant="contained"
                            title="Modifier"
                            onPress={handleSubmit(onSubmit)} />
                    </Animated.View>
                }


                <View className="m-5">

                    <Button variant="outlined"
                        title="Modifier les utilisateurs"
                        onPress={() => router.push({
                            pathname: "/[id]/edit-users",
                            params: {
                                id: String(id)
                            }
                        })} />
                </View>

            </Animated.ScrollView>
        </SafeAreaView>
    )
}