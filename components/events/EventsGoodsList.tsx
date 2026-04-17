import { useCheckGood, useDeleteGood, useGetGoods, usePostGood, usePutGood } from "@/hooks/api/useGoods";
import { Event, Good, TripUser } from "@/types/models";
import { useEffect, useMemo, useState } from "react";
import { Control, useForm, useWatch } from "react-hook-form";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutRight, StretchInX, StretchOutX } from "react-native-reanimated";
import { Toast } from "toastify-react-native";
import { FormText } from "../form/FormText";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";



const GoodFormV2 = ({ control, onSubmit, onDelete, isSubmitting, autoFocus }: {
    control: Control<Good>,
    onSubmit: () => Promise<void>,
    onDelete: () => Promise<void>,
    isSubmitting?: boolean,
    autoFocus?: boolean
}) => {



    const _id = useWatch({
        control,
        name: "_id"
    });


    return (
        <View className="flex-row gap-2 items-center">
            <Button className=""
                disabled={isSubmitting}
                onPress={onSubmit}>
                {isSubmitting ?
                    <ActivityIndicator size="small" />
                    :
                    <IconSymbol
                        name={_id ? "pencil" : "plus"}
                        color="gray"
                        size={24} />
                }
            </Button>
            <View className="flex-1">
                <FormText
                    control={control}
                    name="name"
                    rules={{
                        required: true
                    }}
                    autoFocus={autoFocus}
                    endAdornment={_id && <Pressable
                        onPress={() => Alert.alert("Retirer de la liste ?",
                            "", [
                            {
                                text: "Annuler",
                            },
                            {
                                text: "Supprimer",
                                onPress: onDelete
                            }
                        ])}
                        className="mx-2 rounded-full p-1 bg-gray-200">
                        <IconSymbol name="trash.fill" color="red" size={16} />
                    </Pressable>}
                />
            </View>
        </View>
    )

}



export const EventsGoodsList = ({ event, user }: { event: Event, user?: TripUser }) => {

    const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetGoods(
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
        }
        else {
            await postGood.mutateAsync(data);
        }
        Toast.success("Panier modifié");
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
                    Tu peux partager ici des choses à acheter pour l'activité.
                </Text>
            </View>
            <View className="gap-2">
                {(!selectedGood && goods?.length < 40 ) &&

                    <Animated.View
                        entering={SlideInRight}
                        exiting={SlideOutRight}
                        className="flex-row gap-2 pl-5 items-center">
                        <GoodFormV2 control={control}
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

                            <GoodFormV2 control={control}
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