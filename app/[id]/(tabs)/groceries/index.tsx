import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetGroceries } from "@/hooks/api/useGroceries";
import { useStyles } from "@/hooks/styles/useStyles";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

export default function TripGroceries() {


    const { id } = useLocalSearchParams();


    const { data, fetchNextPage, hasNextPage, } = useGetGroceries(id)

    const groceries = useMemo(() => data?.pages?.flatMap((page) => page?.data).flatMap((page) => page.items), [data]);
    const { container } = useStyles();


    const [selectedGrocery, setSelectedGrocery] = useState(null);


    const { reset, handleSubmit, control } = useForm();

    useEffect(() => {
        if (!!selectedGrocery)
            reset(selectedGrocery)
    }, [selectedGrocery]);

    const onSubmit = async (grocery) => {
        console.log(JSON.stringify(grocery));
        setSelectedGrocery(null);
    }


    return (
        <Animated.ScrollView style={container}>

            <View className="flex gap-1">
                {groceries?.map((grocery) => (
                    <View className="flex flex-row justify-between">
                    <Pressable key={grocery.id}
                        onPress={() => console.log("Pressed")}
                        onLongPress={() => setSelectedGrocery(grocery)}
                        className="flex flex-row gap-1">
                        <IconSymbol name="circle" size={24} color="black" />
                        <Text className="text-lg text-secondary">{grocery.name}</Text>
                    </Pressable>

                    <Text className="text-secondary font-italic">
                        {grocery.meal?.name}

                    </Text>
                    </View>
                ))}
            </View>



            <Modal visible={!!selectedGrocery}
                onRequestClose={() => setSelectedGrocery(null)}
                animationType="slide">
                <Animated.ScrollView style={container}>

                    <View className="flex flex-row items-center justify-between">
                        <Pressable onPress={() => setSelectedGrocery(null)} className="my-2">
                            <Text className="text-secondary">
                                Annuler
                            </Text>
                        </Pressable>

                        <Button title="Modifier" onPress={handleSubmit(onSubmit)}/>
                    </View>
                    <View className="flex gap-5">
                        <FormText control={control} name="name" />
                        <Button title="Supprimer" className="bg-red-400" />
                    </View>



                </Animated.ScrollView>
            </Modal>

        </Animated.ScrollView>
    )
}