import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { TripContext } from "@/context/TripContext";
import { useGetTripUser, useUpdateTripUser } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function UsernameSetting() {

    const router = useRouter();
    const { me , trip} = useContext(TripContext);
    const { data: user } = useGetTripUser(trip._id, me?._id);
    const updateUser = useUpdateTripUser(trip._id, user?._id);
    const colors = useColors();

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
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.ScrollView contentContainerStyle={{ padding: 16 }}>
                <Animated.View entering={FadeIn} className="mb-6">
                    <Text className="text-3xl font-bold dark:text-white" style={{ color: colors.text }}>
                        Modifier votre nom
                    </Text>
                </Animated.View>
                <Animated.View entering={FadeIn.delay(100)} className="mb-8">
                    <FormText
                        control={control}
                        name="name"
                        placeholder="Votre nom"
                        rules={{ required: true, maxLength: 25 }}
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.delay(200)}>
                    <Button
                        isLoading={updateUser.isPending}
                        onPress={handleSubmit(onSubmit)}
                        variant="contained"
                        title="Enregistrer"
                    />
                </Animated.View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
