import { TripUsersForm } from "@/components/trips/TripUsersForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import useColors from "@/hooks/styles/useColors";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function NewTripUsers() {

    const { control, handleSubmit } = useFormContext();

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

    const { text } = useColors();

    return (
        <KeyboardAvoidingView behavior="padding"
            keyboardVerticalOffset={64}
            style={styles.container}>
            <Animated.ScrollView className="flex-1 my-5">
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
                <View className="m-5">
                    <TripUsersForm control={control} />
                </View>
            </Animated.ScrollView>

        </KeyboardAvoidingView>
    )
}