import { FormText } from "@/components/form/FormText";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useUpdateTripUser } from "@/hooks/api/useTrips";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useMemo, useRef } from "react";
import { useController, useForm, useWatch } from "react-hook-form";
import { View } from "react-native";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";



const avatars = [
    "https://avatar.iran.liara.run/public/50",
    "https://avatar.iran.liara.run/public/18",
    "https://avatar.iran.liara.run/public/30",
    "https://avatar.iran.liara.run/public/55",
    "https://avatar.iran.liara.run/public/60",
    "https://avatar.iran.liara.run/public/90",
    "https://avatar.iran.liara.run/public/30",


];



export default function EditUserPage() {


    const { id } = useLocalSearchParams();

    const { me } = useContext(TripContext);

    const { control,
        handleSubmit,
        reset,
        formState: { isDirty } } = useForm();

    const { field: { value: avatar, onChange } } = useController({
        control,
        name: "avatar"
    });
    const name = useWatch({
        control,
        name: "name"
    });


    const updateTripUser = useUpdateTripUser(String(id), String(me?._id));

    useEffect(() => {
        reset(me);
    }, [me, reset]);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%", "50%"], []);

    const router = useRouter();
    const onSubmit = async (data) => {
        updateTripUser.mutateAsync(data);
        router.back();
    }


    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                <View className="flex h-lg justify-center items-center gap-5">
                    <View className="flex items-center justify-center gap-2">
                        <Pressable onPress={() => bottomSheetRef.current?.expand()}>
                            <Avatar
                                src={avatar}
                                alt={name?.charAt(0)}
                                size2="xl"
                            />


                        </Pressable>
                        <FormText control={control} name="name" rules={{ required: true }} />
                    </View>
                    <View className="my-5">
                        <Button disabled={!isDirty}
                            title="Modifier"
                            onPress={handleSubmit(onSubmit)}
                            isLoading={updateTripUser.isPending} 
                            variant="contained"/>
                    </View>


                </View>

                <BottomSheet ref={bottomSheetRef}
                    index={-1}
                    enableDynamicSizing={false}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    handleStyle={{
                        backgroundColor: "primary"
                    }}
                    backgroundStyle={{
                        backgroundColor: "primary"
                    }}
                >
                    <BottomSheetScrollView contentContainerStyle={styles.bottomSheet}>
                        <View className="flex flex-row flex-wrap gap-5 justify-center">
                            {avatars.map((v, index) =>
                                <Pressable key={index} onPress={() => {
                                    onChange(v);
                                    bottomSheetRef.current?.close()
                                }}>
                                    <Avatar src={v} size2="xl" />
                                </Pressable>
                            )}
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
            </GestureHandlerRootView>
        </SafeAreaView>
    )

}






