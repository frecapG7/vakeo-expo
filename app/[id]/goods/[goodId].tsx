import { GoodForm } from "@/components/goods/GoodForm";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useDeleteGood, useGetGood, useGetGoods, usePutGood } from "@/hooks/api/useGoods";
import { Good } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import { Toast } from "toastify-react-native";

export default function EditGood() {
    const { id: tripId, goodId } = useLocalSearchParams<{ id: string, goodId: string }>();
    const router = useRouter();

    const { data: good, isLoading } = useGetGood(tripId, goodId);
    const { mutate: putGood, isPending, isSuccess } = usePutGood(tripId);
    const deleteGood = useDeleteGood(tripId);
    const [showSimilar, setShowSimilar] = useState(false);

    const { data: similarGoods } = useGetGoods(tripId, { search: good?.name }, {
        enabled: showSimilar && !!good?.name
    });

    const { control, handleSubmit, reset } = useForm<Partial<Good>>({
        defaultValues: {
            name: "",
            quantity: "",
            unit: ""
        }
    });

    useEffect(() => {
        if (good) {
            reset(good);
        }
    }, [good, reset]);


    useEffect(() => {
        if (isSuccess) {
            router.back();
        }
    }, [isSuccess, router]);

    const onSubmit = (data: Partial<Good>) => {
        putGood({
            ...good,
            ...data,
            _id: goodId,
            trip: tripId
        } as Good);
    };

    const onDelete = async (data: Good) => {
        await deleteGood.mutateAsync(data);
        router.back();
        Toast.success("Élément supprimé")
    }

    return (
        <View className="flex-1 p-4">
            <View className="mb-6 flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-dark dark:text-white">Modifier l'article</Text>
                <Button
                    title="Supprimer"
                    onPress={() => Alert.alert("Retirer de la liste ?",
                        "", [
                        {
                            text: "Annuler",
                        },
                        {
                            text: "Supprimer",
                            onPress: () => onDelete(good)
                        }
                    ])}
                    variant="danger"
                    size="small"
                />
            </View>
            <View className="flex-1">
                <GoodForm control={control} />

                <Pressable
                    className="mt-4 flex-row items-center gap-2"
                    onPress={() => setShowSimilar(!showSimilar)}>
                    <IconSymbol name={showSimilar ? "chevron.down" : "chevron.right"} size={20} color="gray" />
                    <Text className="text-gray-600 dark:text-gray-400">Afficher similaire</Text>
                </Pressable>

                {showSimilar && similarGoods?.pages && (
                    <View className="mt-3 gap-2">
                        {similarGoods.pages.flatMap(page => page.goods)
                            .filter(g => g._id !== goodId)
                            .map(item => (
                                <View key={item._id} className="flex-row items-center gap-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <IconSymbol name={item.checked ? "circle.fill" : "circle"} size={12} color="gray" />
                                    <View className="flex-1">
                                        <Text className={`dark:text-white capitalize ${item.checked ? "line-through" : ""}`}>
                                            {item.name}
                                        </Text>
                                        {item.event?.name && (
                                            <Text className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                {item.event.name}
                                            </Text>
                                        )}
                                    </View>
                                    {item.quantityNumber && (
                                        <Text className={`text-sm text-gray-500 dark:text-gray-400 ${item.checked ? "line-through" : ""}`}>
                                            {item.quantityNumber} {item.unit}
                                        </Text>
                                    )}
                                </View>
                            ))}
                    </View>
                )}

                <View className="mt-6">
                    <Button
                        title="Modifier"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={isPending || isLoading}
                        variant="contained"
                        disabled //Disabled until api update
                        className="w-full"
                    />
                </View>
            </View>
        </View>
    );
}
