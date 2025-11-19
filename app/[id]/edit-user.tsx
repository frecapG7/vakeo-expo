import { FormText } from "@/components/form/FormText";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useUpdateTripUser } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import { useController, useForm, useWatch } from "react-hook-form";
import { View } from "react-native";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";



const avatars = [
    "https://storage.googleapis.com/vakeo_dev/avatar/chat.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/chien.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/dauphin.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/fille%20noir.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/garcon%20noir.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/fille.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/garcon.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/papie.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/famille.png",
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

    const colors = useColors();
    const router = useRouter();
    const onSubmit = async (data) => {
        updateTripUser.mutateAsync(data);
        router.back();
    }


    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                <View className="flex justify-center items-center gap-5">
                    <View className="flex items-center justify-center gap-2">
                        <Pressable onPress={() => bottomSheetRef.current?.expand()}>
                            <Avatar
                                src={avatar}
                                alt={name?.charAt(0)}
                                size2="xl"
                            />
                        </Pressable>
                        <View className="flex-row">
                            <FormText control={control} name="name" rules={{ required: true }} />
                        </View>
                    </View>
                    <View className="my-5">
                        <Button disabled={!isDirty}
                            title="Modifier"
                            onPress={handleSubmit(onSubmit)}
                            isLoading={updateTripUser.isPending}
                            variant="contained" />
                    </View>


                </View>

                <BottomSheet ref={bottomSheetRef}
                    index={-1}
                
                    backgroundStyle={{
                        backgroundColor: colors.neutral,
                        ...styles.bottomSheet
                    }}
                    enablePanDownToClose={true}
                    onChange={() => console.log("What to do?")}
                >
                    <BottomSheetFlatList
                        data={avatars}
                         keyExtractor={(i) => i}
                         numColumns={3}    
                         renderItem={({item: avatar}) => (
                             <Pressable onPress={() => {
                                    onChange(avatar);
                                    bottomSheetRef.current?.close()
                                }}>
                                    <Avatar src={avatar} size2="xl" />
                                </Pressable>
                            )}/>
                </BottomSheet>
            </GestureHandlerRootView>
        </SafeAreaView>
    )

}






