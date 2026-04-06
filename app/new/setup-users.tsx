import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


const MAX_USERS_LENGTH = 20;

export default function NewTripUsers() {


    const { control, handleSubmit } = useFormContext();
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


    const navigation = useNavigation();

    const onSubmit = (data: any) => console.log(JSON.stringify(data));
    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <Button variant="contained"
                    size="small"
                    title="Suivant"
                    onPress={handleSubmit(onSubmit)}>
                </Button>
        })
    }, [navigation, onSubmit]);


    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text className="text-2xl font-bold dark:text-white">
                    Choisis comment partager avec tes amis
                </Text>
                <Text className="text-md dark:text-gray-200">
                    Décide de comment tes amis peuvent accéder au projet.
                </Text>
                <Text className="text-md dark:text-gray-200 gap-1">
                    <Text className="font-bold">Important </Text>
                    tu ne pourras plus modifier ce choix une fois que tu aura créer ton projet
                </Text>
            </View>





            <Animated.FlatList
                data={users}
                contentContainerClassName="gap-0 bg-gray-200 p-1 rounded-t-lg"
                renderItem={({ item, index, separators }) =>
                    <FormText
                        control={control}
                        name={`users.${index}.name`}
                        rules={{
                            required: true,
                            maxLength: 25
                        }}
                        endAdornment={
                            <Pressable
                                className="mx-2"
                                onPress={() => me !== index && remove(index)}>
                                {me === index ?
                                    <Text className="font-bold bg-blue-600 p-1 text-white">Moi</Text> :
                                    <IconSymbol name="xmark.circle" size={24} color="black" />}
                            </Pressable>}
                    />
                }
                keyExtractor={(item) => item.key}
                ItemSeparatorComponent={() => <View className="h-0.2 bg-gray-600" />}
                itemLayoutAnimation={LinearTransition}
                ListFooterComponent={() => users?.length < MAX_USERS_LENGTH &&
                    <Animated.View entering={FadeInDown}
                        exiting={FadeInDown}>
                        <Pressable className="bg-gray-200 rounded-b-lg"
                            onPress={() => {
                                append({ name: "" });
                            }}>
                            <Text className="text-md font-bold text-blue-500 p-2">
                                Ajouter un participant
                            </Text>
                        </Pressable>
                    </Animated.View>}
            />

        </SafeAreaView>
    )
}