import { GoodForm } from "@/components/goods/GoodForm";
import { Button } from "@/components/ui/Button";
import { useTrip } from "@/context/TripContext";
import { usePostGood } from "@/hooks/api/useGoods";
import { Good } from "@/types/models";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Toast } from "toastify-react-native";


const defaultValues = {
    name: "",
    checked: false
};
type GoodFormInputs = Omit<Good, '_id' | 'createdBy' | 'checked'>;


export default function NewGood() {
    const { eventId } = useLocalSearchParams<{ id: string, eventId?: string }>();

    const { trip } = useTrip();
    const { control, handleSubmit, reset } = useForm<GoodFormInputs>({
        defaultValues
    });

    const { mutateAsync: postGood, isPending, isSuccess } = usePostGood(trip._id);

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
        <View className="flex-1 bg-mist dark:bg-ink p-5">
            <View className="flex-1 mt-6">
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
