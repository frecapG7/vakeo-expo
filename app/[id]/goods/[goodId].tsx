import { GoodForm } from "@/components/goods/GoodForm";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTrip } from "@/context/TripContext";
import { useGetGood, useGetGoods, usePutGood } from "@/hooks/api/useGoods";
import { Good } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { Toast } from "toastify-react-native";

export default function EditGood() {
    const { goodId } = useLocalSearchParams<{ id: string, goodId: string }>();
    const { trip } = useTrip();
    const router = useRouter();

    const { data: good, isLoading } = useGetGood(trip?._id, goodId);
    const { mutateAsync: putGood, isPending, isSuccess } = usePutGood(trip?._id);
    const [showSimilar, setShowSimilar] = useState(false);

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

    return (
        <View className="flex-1 bg-mist dark:bg-ink p-5">
            <View className="flex-1 mt-6">
                <GoodForm control={control} />
                <Pressable
                    className="mt-4 flex-row items-center gap-2"
                    onPress={() => setShowSimilar(!showSimilar)}>
                    <IconSymbol name={showSimilar ? "chevron.down" : "chevron.right"} size={20} color="#9AA3B8" />
                    <Text className="text-night/60 dark:text-white/60">Afficher similaire</Text>
                </Pressable>

                {showSimilar && similarGoods?.pages && (
                    <View className="mt-3 gap-2">
                        {similarGoods.pages.flatMap(page => page.goods)
                            .filter(g => g._id !== goodId)
                            .map(item => (
                                <View key={item._id} className="flex-row items-center gap-3 p-2 bg-white dark:bg-night rounded-xl border border-mist dark:border-white/10">
                                    <IconSymbol name={item.checked ? "circle.fill" : "circle"} size={12} color="#9AA3B8" />
                                    <View className="flex-1">
                                        <View className="flex-row flex-wrap items-baseline gap-2">
                                            <Text className={`text-night dark:text-white capitalize ${item.checked ? "line-through" : ""}`}>
                                                {item.name}
                                                {item.quantityNumber != null && (
                                                    <Text className="text-sm text-night/60 dark:text-white/70"> ({item.quantityNumber} {item.unit})</Text>
                                                )}
                                            </Text>
                                        </View>
                                        {(item.event?.name || item.createdBy?.name) && (
                                            <Text className="text-xs text-night/60 dark:text-white/70 mt-0.5">
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
