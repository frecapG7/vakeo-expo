import { EventInfoForm } from "@/components/events/EventInfoForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { Event } from "@/types/models";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function NewEventGeneralInfo() {

    const { id } = useLocalSearchParams();
    const { control, trigger } = useFormContext<Event>();

    const navigation = useNavigation();


    const router = useRouter();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <Button variant="contained"
                    size="small"
                    title="Suivant"
                    onPress={async () => {
                        const valid = await trigger(["name", "details"]);
                        if (valid)
                            router.push({
                                pathname: "/[id]/events/new/setup-event-users",
                                params: {
                                    id: String(id)
                                }

                            })
                    }}
                />
        })
    }, [navigation, router])


    return (
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView style={{ flex: 1 }} className="flex flex-grow">
                <View className="m-5">
                    <Text className="text-2xl font-bold dark:text-white">
                        Donne un nom à ton activité
                    </Text>
                    <Text className="text-gray-400">
                        Ajoute un nom et une description pour aider tes amis à comprendre ce que tu prévois
                    </Text>
                </View>
                <View className="m-5">
                    <EventInfoForm control={control} />
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    )
}