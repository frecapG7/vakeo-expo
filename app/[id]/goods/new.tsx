import { GoodForm } from "@/components/goods/GoodForm";
import { Button } from "@/components/ui/Button";
import { usePostGood } from "@/hooks/api/useGoods";
import { Good } from "@/types/models";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

export default function NewGood() {
    const { id: tripId } = useLocalSearchParams<{ id: string }>();

    const { control, handleSubmit, reset } = useForm<Partial<Good>>({
        defaultValues: {
            name: "",
            quantity: "",
            unit: ""
        }
    });

    const { mutate: postGood, isPending, isSuccess } = usePostGood(tripId);

    useEffect(() => {
        if (isSuccess) {
            reset();
        }
    }, [isSuccess, reset]);

    const onSubmit = (data: Partial<Good>) => {
        postGood({
            ...data,
            name: data.name!,
            trip: tripId!
        } as Good);
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
