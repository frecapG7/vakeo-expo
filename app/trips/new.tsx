import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { usePostTrip } from "@/hooks/api/useTrips";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { ItemUsersForm } from "../../components/items/ItemUsersForm";

export default function NewTripItem() {

    const { control, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            description: "",
            users: [{
                name: "Moi",
            }, {
                name: "",
            }],
            color: "red-200"
        }
    });


    const router = useRouter();
    const postTrip = usePostTrip();
    const onSubmit = async (data: any) => {
        const resutlt = await postTrip.mutateAsync(data);
        router.replace(`/trips/${resutlt.id}`);
    }


    return (
        <Animated.ScrollView style={{
            flex: 1,
            marginHorizontal: 10,
        }}>

            <View className="flex flex-col gap-5 mx-4 rounded-lg p-4">
                <FormText control={control} name="name" label="Nom du projet" rules={{ required: true }} />

                <View className="flex flex-col gap-2">
                    <Text className="text-sm font-bold mx-2">Participants</Text>
                    <ItemUsersForm control={control} />
                </View>
                <View className="flex items-center justify-center">
                    <Button title="Continuer" onPress={handleSubmit(onSubmit)} isLoading={postTrip.isPending} />
                </View>
            </View>

        </Animated.ScrollView>
    )

}