import { EventIcon } from "@/components/events/EventIcon";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { toLabel } from "@/lib/eventUtils";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";



const eventType = ["MEAL", "RESTAURANT", "SPORT", "PARTY", "ACTIVITY"];

export default function NewEventType() {


    const { id } = useLocalSearchParams();

    const { control } = useFormContext();


    const { field: { value: type, onChange: setType } } = useController({
        control,
        name: "type",
        rules: {
            required: true
        }
    })


    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <Button variant="contained"
                    size="small"
                    title="Suivant"
                    disabled={type === ""}
                    onPress={async () => {
                        router.push({
                            pathname: "/[id]/events/new/setup-event-info",
                            params: {
                                id: String(id)
                            }
                        })
                    }}>

                </Button>
        })
    }, [navigation, type])




    return (
        <Animated.ScrollView style={styles.container}>
            <View className="my-5 gap-2 p-2">
                <Text className="text-2xl font-bold dark:text-white" numberOfLines={3}>
                    Quel type d'activité prévois tu ?
                </Text>
                <Text className="text-gray-400" numberOfLines={5}>
                    Choisis un type d'activité afin d'améliorer l'organisation de ton voyage
                </Text>


            </View>
            <View className="gap-5 flex-wrap items-center flex-row">
                {eventType.map((eventType) => (

                    <Pressable
                        key={eventType}
                        onPress={() => setType(eventType)}
                        className={`flex-row gap-1 mx-2 items-center py-2 px-6 border border-gray-600 rounded-full ${eventType === type ? "bg-orange-600 border-orange-400" : "bg-white dark:bg-gray-900 "}`}>

                        {eventType === type &&
                            <Animated.View entering={FadeIn} exiting={FadeOut}>
                                <IconSymbol name="checkmark" size={16} color="white" />
                            </Animated.View>
                        }
                        <EventIcon name={eventType} size="sm" />
                        <Text className={`capitalize ${eventType === type ? "font-bold text-white" : "dark:text-gray-400"}`}>
                            {toLabel({ type: eventType })}
                        </Text>

                    </Pressable>

                ))}
            </View>
        </Animated.ScrollView>
    )


}