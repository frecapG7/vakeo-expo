import { useCheckGood, useDeleteGood, useGetGoods, usePostGood, usePutGood } from "@/hooks/api/useGoods";
import { Event, Good, TripUser } from "@/types/models";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutRight, StretchInX, StretchOutX } from "react-native-reanimated";
import { Toast } from "toastify-react-native";
import { GoodForm } from "../goods/GoodForm";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";




export const EventsGoodsList = ({ event, user }: { event: Event, user?: TripUser }) => {

    const { data } = useGetGoods(
        event.trip,
        {
            event: event._id
        });

    const checkGood = useCheckGood(event?.trip);
    const putGood = usePutGood(event?.trip);
    const postGood = usePostGood(event?.trip);
    const deleteGood = useDeleteGood(event?.trip);
    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);


    const onCheck = async (good: Good) => await checkGood.mutateAsync(good); 

    const [selectedGood, setSelectedGood] = useState<Good | null>();

    const { control, handleSubmit, reset, formState: { isSubmitSuccessful } } = useForm<Good>({
        defaultValues: {
            event,
            trip: event?.trip,
            createdBy: user
        }
    });
    useEffect(() => {
        if (selectedGood)
            reset(selectedGood)
        else
            reset({
                name: "",
                quantity: "",
                event,
                trip: event?.trip,
                createdBy: user
            });
    }, [selectedGood])

    const onSubmit = async (data: Good) => {
        if (data._id) {
            await putGood.mutateAsync(data);
            setSelectedGood(null);
            Toast.success("Liste modifiée");
        }
        else {
            await postGood.mutateAsync(data);
            Toast.success("Élément ajouté");
        }
    }

    useEffect(() => {
        if (isSubmitSuccessful)
            reset({
                name: "",
                quantity: "",
                event,
                trip: event?.trip,
                createdBy: user
            })
    }, [isSubmitSuccessful, reset, event, user])

    return (
        <View style={{ flex: 1 }}>
            <View className="mb-4">
                <Text className="dark:text-white text-lg">
                    Liste partagée de l'activité.
                </Text>
                <Text className="text-gray-400">
                    Tu peux partager ici des choses pour l'activité.
                </Text>
            </View>
            <View className="gap-2">
                {(!selectedGood && goods?.length < 40 ) &&

                    <Animated.View
                        entering={SlideInRight}
                        exiting={SlideOutRight}
                        className="flex-row gap-2 pl-5 items-center">
                        <GoodForm control={control}
                            onSubmit={handleSubmit(onSubmit)}
                            isSubmitting={postGood.isPending}
                        />
                    </Animated.View>
                }
                {goods?.map((good) =>
                    selectedGood?._id !== good._id ?
                        <View key={good._id}
                            className={`flex-row  items-center rounded-xl py-2 ${good.checked ? "opacity-50" : ""}`}>
                            <Button className="px-5"
                                onPress={() => onCheck(good)}
                                disabled={false}>
                                <IconSymbol name={good.checked ? "checkmark.circle.fill" : "circle"}
                                    color={good.checked ? "green" : "gray"}
                                    size={24} />
                            </Button>
                            <Pressable
                                onPress={() => setSelectedGood(null)}
                                onLongPress={() => setSelectedGood(good)}
                                disabled={good?.checked}
                                className="flex-1 flex-row justify-between items-center border-b border-orange-200 dark:border-gray-200">
                                <Text className={`dark:text-white capitalize  ${good.checked && "line-through"}`}>
                                    <Text className="text-xl">
                                        {good.name}
                                    </Text>
                                    <Text className="text-md">
                                        {good.quantity && `(${good?.quantity})`}
                                    </Text>
                                </Text>
                            </Pressable>
                        </View>
                        :
                        <Animated.View
                            key={good._id}
                            entering={StretchInX}
                            exiting={StretchOutX}
                            className="pl-5">
                            <GoodForm control={control}
                                onSubmit={handleSubmit(onSubmit)}
                                isSubmitting={putGood?.isPending}
                                autoFocus
                                onDelete={async () => {
                                    await deleteGood.mutateAsync(good);
                                    setSelectedGood(null);
                                }}

                            />
                        </Animated.View>
                )}
            </View>
        </View>
    )
}