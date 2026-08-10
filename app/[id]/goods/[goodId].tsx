import { GoodForm } from "@/components/goods/GoodForm";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useDeleteGood, useGetGood, useGetGoods, usePutGood } from "@/hooks/api/useGoods";
import { Good } from "@/types/models";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import { Toast } from "toastify-react-native";

export default function EditGood() {
    const { goodId } = useLocalSearchParams<{ id: string, goodId: string }>();
    const { trip, me } = useContext(TripContext);
    const router = useRouter();

    const { data: good, isLoading } = useGetGood(trip?._id, goodId);
    const { mutateAsync: putGood, isPending, isSuccess } = usePutGood(trip?._id, me?._id);
    const deleteGood = useDeleteGood(trip?._id, me?._id);
    const [showSimilar, setShowSimilar] = useState(false);
    const navigation = useNavigation();

    const { data: similarGoods } = useGetGoods(trip?._id, { search: good?.name }, {
        enabled: showSimilar && !!good?.name
    });

    const { control, handleSubmit, reset } = useForm<Partial<Good>>({
        defaultValues: {
            name: "",
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


    const onSubmit = async (data: Partial<Good>) => {
        await putGood(data);
        Toast.success("Modifié avec succès");
    };

    const onDelete = async (data: Good) => {
        router.back();
        deleteGood.mutate(data, {
            onSuccess: () => {
                Toast.success("Élément supprimé")
            }
        });
    }
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => good && Alert.alert("Retirer de la liste ?",
                    "", [
                    {
                        text: "Annuler",
                    },
                    {
                        text: "Supprimer",
                        onPress: () => good && onDelete(good)
                    }
                ])}>
                    <IconSymbol name="trash" size={24} />
                </Pressable>
            )
        });
    }, [good]);

    return (
        <View className="flex-1 p-4">
            {/* <View className="mb-6 flex-row justify-end items-center">
                <Button
                    title="Supprimer"
                   
                    variant="danger"
                    size="small"
                    disabled={!good}
                />
            </View> */}
            <View className="flex-1 mt-6">
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
                                        <View className="flex-row flex-wrap items-baseline gap-2">
                                            <Text className={`dark:text-white capitalize ${item.checked ? "line-through" : ""}`}>
                                                {item.name}
                                                {item.quantityNumber && item.unit && (
                                                    <Text className="text-sm text-gray-500 dark:text-gray-400"> ({item.quantityNumber} {item.unit})</Text>
                                                )}
                                            </Text>
                                        </View>
                                        {(item.event?.name || item.createdBy?.name) && (
                                            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {item.event?.name}
                                                {item.event?.name && item.createdBy?.name ? " • " : ""}
                                                {item.createdBy?.name && `ajouté par ${item.createdBy.name}`}
                                            </Text>
                                        )}
                                    </View>
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
                        className="w-full"
                    />
                </View>
            </View>
        </View>
    );
}
