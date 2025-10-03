import { FormText } from "@/components/form/FormText";
import BottomSheet from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { usePostTrip } from "@/hooks/api/useTrips";
import { useAddStorageTrip } from "@/hooks/storage/useStorageTrips";
import useColors from "@/hooks/styles/useColors";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { useController, useFieldArray, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


const data = [
    {
        "name": "Icon 2",
        "uri": "https://picsum.photos/seed/501/3000/1000"
    },
    {
        "name": "Icon 3",
        "uri": "https://picsum.photos/seed/502/3000/1000"
    },
    {
        "name": "Icon 4",
        "uri": "https://picsum.photos/seed/503/3000/1000"
    },
    {
        "name": "Icon 5",
        "uri": "https://picsum.photos/seed/504/3000/1000"
    },
    {
        "name": "Icon 6",
        "uri": "https://picsum.photos/seed/505/3000/1000"
    },
    {
        "name": "Icon 7",
        "uri": "https://picsum.photos/seed/506/3000/1000"
    },
    {
        "name": "Icon 8",
        "uri": "https://picsum.photos/seed/507/3000/1000"
    },
    {
        "name": "Icon 9",
        "uri": "https://picsum.photos/seed/508/3000/1000"
    },
    {
        "name": "Icon 10",
        "uri": "https://picsum.photos/seed/509/3000/1000"
    },
    {
        "name": "Icon 11",
        "uri": "https://picsum.photos/seed/510/3000/1000"
    },
    {
        "name": "Icon 12",
        "uri": "https://picsum.photos/seed/511/3000/1000"
    },
    {
        "name": "Icon 13",
        "uri": "https://picsum.photos/seed/512/3000/1000"
    }
]



const MAX_USERS_LENGTH = 20;

export default function NewTripPage() {


    const colors = useColors();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            description: "",
            users: [{
                name: "Moi",
            }, {
                name: "",
            }],
            image: data[0].uri
        }
    });
    const { fields: users, append, remove } = useFieldArray({
        control,
        name: "users",
        keyName: "key",
        rules: {
            minLength: 1,
            maxLength: MAX_USERS_LENGTH
        }
    });

    const [me, setMe] = useState(0)


    const postTrip = usePostTrip();

    const router = useRouter();

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%", "50%"], []);

    const { field: { value, onChange } } = useController({
        control,
        name: "image",
    })


    const addStorageTrip = useAddStorageTrip();

    const onSubmit = async (data: any) => {
        const result = await postTrip.mutateAsync(data);
        await addStorageTrip.mutateAsync({
            _id: result._id,
            name: result.name,
            image: result.image,
            user: result.users[me]
        });
        router.replace(`./${result._id}`);
    }

    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView>
                <Text className="text-xl font-bold ml-5 dark:text-white">Titre</Text>
                <View className="flex flex-row gap-1">
                    <Button
                        onPress={() => bottomSheetRef.current?.expand()}
                        className="bg-gray-200 p-1">
                        <Image source={value}
                            style={{
                                flex: 1,
                                width: 40,
                                height: 40,
                            }}
                            contentFit="cover" />
                    </Button>
                    <FormText control={control}
                        name="name"
                        className="flex-grow"
                        rules={{
                            required: true,
                            maxLength: 50
                        }}
                    />
                </View>
                <View className="rounded-lg my-5">
                    <Text className="text-xl font-bold ml-5 dark:text-white">Participants</Text>
                    <Animated.FlatList
                        data={users}
                        contentContainerClassName="gap-0 bg-gray-200 p-1 rounded-t-lg"
                        renderItem={({ item, index, separators }) =>
                            <View className="flex-row justify-between">
                                <FormText
                                    control={control}
                                    name={`users.${index}.name`}
                                    rules={{
                                        required: true,
                                        maxLength: 25
                                    }}
                                    className="flex-grow"
                                />
                                <Pressable
                                    className="mx-2"
                                    onPress={() => me !== index && remove(index)}>
                                    {me === index ?
                                        <Text className="font-bold bg-blue-600 p-1 text-white">Moi</Text> :
                                        <IconSymbol name="xmark.circle" size={24} color="black" />}
                                </Pressable>
                            </View>
                        }
                        keyExtractor={(item) => item.key}
                        ItemSeparatorComponent={() => <View className="h-0.2 bg-gray-600" />}
                        itemLayoutAnimation={LinearTransition}
                    />
                    {users?.length < MAX_USERS_LENGTH &&
                        <Animated.View entering={FadeInDown} exiting={FadeInDown}>
                            <Pressable className="bg-gray-200 rounded-b-lg"
                                onPress={() => {
                                    append({ name: "" });
                                }}>
                                <Text className="text-md font-bold text-blue-500 p-2">
                                    Ajouter un participant
                                </Text>
                            </Pressable>
                        </Animated.View>}
                </View>
                <View className="flex items-center justify-center mt-10">
                    <Button
                        title="Continuer"
                        variant="contained"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={postTrip.isPending}
                        className="w-lg"
                    />
                </View>



                <BottomSheet bottomSheetRef={bottomSheetRef}>
                    <BottomSheetScrollView>
                        <View className="flex flex-row flex-wrap gap-2 justify-center px-2">
                            {data.map((item, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        onChange(item.uri);
                                        bottomSheetRef.current?.close();
                                    }}
                                >   
                                    <Image
                                        style={{
                                            flex: 1,
                                            width: 100,
                                            height: 100
                                        }}
                                        source={item.uri}
                                        contentFit="cover"
                                        transition={1000} />
                                </Pressable>
                            ))}
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}
