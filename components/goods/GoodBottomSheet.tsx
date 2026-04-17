import styles from "@/constants/Styles"
import { useDeleteGood, usePostGood, usePutGood } from "@/hooks/api/useGoods"
import useColors from "@/hooks/styles/useColors"
import { Good, Trip } from "@/types/models"
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet"
import { useEffect, useMemo, useRef } from "react"
import { useController, useForm } from "react-hook-form"
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import Animated, { FadeIn } from "react-native-reanimated"
import { Toast } from "toastify-react-native"
import { Backdrop } from "../ui/Backdrop"
import { Button } from "../ui/Button"
import { IconSymbol } from "../ui/IconSymbol"


export const GoodBottomSheet = ({ open, good, trip, onClose }: { open: boolean, good?: Good | null, trip: Trip, onClose: () => void }) => {

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

    const { field: { value: quantity, onChange: setQuantity } } = useController({
        control,
        name: "quantity",
        rules: {
            maxLength: 155
        }
    });


    const { field: { value, onChange: setName }, fieldState: { isDirty } } = useController({
        control,
        name: "name",
        rules: {
            required: true,
            minLength: 1,
            maxLength: 100
        },
        defaultValue: ""
    });

    const onSubmit = async (data: any) => {
        if (data._id) {
            await putGood.mutateAsync(data);
            bottomSheetRef.current?.close();
        }
        else {
            await postGood.mutateAsync(data);
            reset(good);

        }
        Toast.success("Panier modifié");

    }
    const onDelete = async (data: Good) => {
        await deleteGood.mutateAsync(data);
        bottomSheetRef.current?.close();
        Toast.success("Panier modifié");
    }

    useEffect(() => {
        reset(good);
    }, [good, reset]);

    useEffect(() => {
        if (open)
            bottomSheetRef.current?.expand();
    }, [bottomSheetRef, good]);

    const valueTextInputRef: React.RefObject<TextInput | null> = useRef<TextInput>(null);
    const quantityTextInputRef: React.RefObject<TextInput | null> = useRef<TextInput>(null);


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
                        <Text className="text-2xl font-bold dark:text-white">{good?._id ? 'Modifier' : 'Nouveau'}</Text>
                    </Pressable>
                    {!!good?._id &&
                        <Animated.View entering={FadeIn}>
                            <Button className="rounded-full border border-red-200 bg-white p-1 justify-center"
                                onPress={() => Alert.alert("Retirer du panier ?",
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

                <View className="my-1">
                    <View>

                        <View className="ml-4">
                            <Text className="italic font-bold dark:text-white">
                                Nom*
                            </Text>
                        </View>
                        <View className="flex-row justify-between items-center bg-gray-200 flex-grow rounded-lg focus:border-2 focus:border-blue-400">

                            <BottomSheetTextInput
                                value={value}
                                onChangeText={(v) => {
                                    setName(v);
                                }}
                                className="flex-grow text-black capitalize h-12"
                                placeholderTextColor={colors.inputPlaceHolder}
                                ref={valueTextInputRef}
                            />
                            {value !== "" &&
                                <Animated.View entering={FadeIn} className="" >
                                    <Button onPress={() => setName("")}>
                                        <IconSymbol name="xmark.circle" color="black" />
                                    </Button>
                                </Animated.View>
                            }
                        </View>
                    </View>
                    <View>
                        <Text className="italic font-bold dark:text-white">
                            Quantité
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center bg-gray-200 flex-grow rounded-lg focus:border-2 focus:border-blue-400">
                        <BottomSheetTextInput
                            onChangeText={setQuantity}
                            value={quantity}
                            className="text-md h-12"
                            placeholderTextColor={colors.inputPlaceHolder}
                            ref={quantityTextInputRef}
                            style={styles.textInput}
                        />
                        {value !== "" &&
                            <Animated.View entering={FadeIn} className="" >
                                <Button onPress={() => setName("")}>
                                    <IconSymbol name="xmark.circle" color="black" />
                                </Button>
                            </Animated.View>
                        }
                    </View>

                    <View className="px-10 mt-2">
                        <Button variant="contained"
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