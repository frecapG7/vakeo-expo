import { EventInfoForm } from "@/components/events/EventInfoForm";
import { Button } from "@/components/ui/Button";
import { Event } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function NewEventGeneralInfo() {

    const { id } = useLocalSearchParams();
    const { control, trigger } = useFormContext<Event>();

    const router = useRouter();


    return (
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
            <View className="m-4">
                <Button variant="contained"
                    size="medium"
                    title="Continuer"
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
            </View>
        </Animated.ScrollView>
    )
}