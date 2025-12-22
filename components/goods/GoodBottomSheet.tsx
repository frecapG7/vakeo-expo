import styles from "@/constants/Styles"
import { useDeleteGood, usePostGood, usePutGood } from "@/hooks/api/useGoods"
import useColors from "@/hooks/styles/useColors"
import { Good, Trip } from "@/types/models"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { Toast } from "toastify-react-native"
import { Backdrop } from "../ui/Backdrop"
import { Button } from "../ui/Button"
import { IconSymbol } from "../ui/IconSymbol"
import { GoodForm } from "./GoodForm"


export const GoodBottomSheet = ({ good, trip, onClose }: { good?: Good | null, trip: Trip, onClose: () => void }) => {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const colors = useColors();

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            _id: "",
            name: "",
            quantity: "1",
            trip: {
                _id: ""
            }
        }
    });

    const postGood = usePostGood(trip?._id);
    const putGood = usePutGood(trip?._id);
    const deleteGood = useDeleteGood(trip?._id);


    const snapPoints = useMemo(() => ["25%"], []);

    const onSubmit = async (data: any) => {
        if (data._id) {
            await putGood.mutateAsync(data);
            bottomSheetRef.current?.close();
        }
        else {
            await postGood.mutateAsync(data);
            reset(good);

        }
        Toast.success(data._id ? "Course modifiée" : "Course ajoutée");

    }
    const onDelete = async (data: Good) => {
        await deleteGood.mutateAsync(data);
        bottomSheetRef.current?.close();
        Toast.success("Course supprimée");
    }


    useEffect(() => {
        reset(good);
    }, [good, reset]);

    useEffect(() => {
        if (good)
            bottomSheetRef.current?.expand();
    }, [bottomSheetRef, good]);


    return (
        <BottomSheet ref={bottomSheetRef}
            index={-1}
            backgroundStyle={{
                backgroundColor: colors.background,
                ...styles.bottomSheet
            }}
            enablePanDownToClose={true}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            snapPoints={snapPoints}
        >

            <BottomSheetView style={{ flex: 1 }} className="gap-2 py-5 px-2">

                <View className="flex-row justify-between items-center">
                    <Pressable className="flex-row gap-1 items-center" onPress={() => {
                        bottomSheetRef.current?.close()
                        onClose();
                    }}>
                        <View className="rounded-full">
                            <IconSymbol name="xmark.circle" color={colors?.text} />
                        </View>
                        <Text className="text-2xl font-bold dark:text-white">{good?._id ? 'Modifier course' : 'Nouvel course'}</Text>
                    </Pressable>
                    {!!good?._id &&
                        <Animated.View entering={FadeIn}>
                            <Button className="rounded-full border border-red-200 bg-white p-1 justify-center"
                                onPress={() => Alert.alert("Voulez vous supprimer cette course ?",
                                    "", [
                                    {
                                        text: "Annuler",
                                        onPress: () => bottomSheetRef?.current?.close()
                                    },
                                    {
                                        text: "Supprimer",
                                        onPress: async () => await onDelete(good)
                                    }
                                ])}>
                                <IconSymbol name="trash" size={24} color="red" />
                            </Button>

                        </Animated.View>

                    }

                </View>

                <View className="gap-5 my-1">
                  
                    <GoodForm control={control} trip={trip} />
                    <View className="px-10 mt-10">
                        <Button variant="contained"
                            className="px-10"
                            title={good?._id ? "Modifier" : "Ajouter"}
                            onPress={handleSubmit(onSubmit)}
                            isLoading={postGood.isPending || putGood.isPending} />
                    </View>
                </View>
            </BottomSheetView>


            <Backdrop visible={deleteGood.isPending} >
                <Animated.View
                    className="flex-1 justify-center items-center ">
                    <ActivityIndicator size="large" />
                </Animated.View>
            </Backdrop>
        </BottomSheet>
    );
}