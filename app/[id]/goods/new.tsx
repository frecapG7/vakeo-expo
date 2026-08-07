import { GoodForm } from "@/components/goods/GoodForm";
import { Button } from "@/components/ui/Button";
import { TripContext } from "@/context/TripContext";
import { usePostGood } from "@/hooks/api/useGoods";
import { Good } from "@/types/models";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Toast } from "toastify-react-native";


const defaultValues = {
    name: "",
    checked: false
};
type GoodFormInputs = Omit<Good, '_id' | 'createdBy' | 'checked'>;


export default function NewGood() {
    const { eventId } = useLocalSearchParams<{ id: string, eventId?: string }>();


    const {me, trip} = useContext(TripContext);
    const { control, handleSubmit, reset } = useForm<GoodFormInputs>({
        defaultValues
    });

    const { mutateAsync: postGood, isPending, isSuccess } = usePostGood(trip._id, me?._id);

    useEffect(() => {
        if (isSuccess) {
            reset(defaultValues);
        }
    }, [isSuccess, reset]);

    const onSubmit = async (data: any) => {
        await postGood({
            ...data,
            trip: trip._id,
            ...(eventId && { event: eventId })
        });
        Toast.success("Ajouté avec succès")
    };

    return (
        <View className="flex-1 p-4">
            <View className="mb-6">
                <Text className="text-2xl font-bold text-dark dark:text-white">Nouvel article</Text>
            </View>
            <View className="flex-1">
                <GoodForm control={control} />
                <View className="mt-6">
                    <Button
                        title="Ajouter"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={isPending}
                        variant="contained"
                        className="w-full"
                    />
                </View>
            </View>
        </View>
    );
}
