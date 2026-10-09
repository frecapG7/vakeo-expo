import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { useTrip } from "@/context/TripContext";
import { useGetTripUser, useUpdateTripUser } from "@/hooks/api/useTrips";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";


export default function UsernameSetting() {

    const router = useRouter();
    const { me, trip } = useTrip();
    const { data: user } = useGetTripUser(trip._id, me?._id);
    const updateUser = useUpdateTripUser(trip._id, user?._id);

    const { control, handleSubmit } = useForm({
        values: {
            name: user?.name || ""
        }
    });

    const onSubmit = async (data: { name: string }) => {
        await updateUser.mutateAsync({
            ...user,
            name: data.name
        });
        router.back();
    };

    return (
        <View className="flex-1 bg-mist dark:bg-ink">
            <Animated.ScrollView contentContainerClassName="px-4 py-5 gap-8">
                <Animated.View entering={FadeIn}>
                    <FormText
                        control={control}
                        name="name"
                        placeholder="Votre nom"
                        rules={{ required: true, maxLength: 25 }}
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.delay(100)}>
                    <Button
                        isLoading={updateUser.isPending}
                        onPress={handleSubmit(onSubmit)}
                        variant="contained"
                        title="Enregistrer"
                    />
                </Animated.View>
            </Animated.ScrollView>
        </View>
    );
}
