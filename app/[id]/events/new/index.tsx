import { EventIcon } from "@/components/events/EventIcon";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Screen } from "@/components/ui/Screen";
import { toLabel } from "@/lib/eventUtils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useController, useFormContext } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const eventType = ["ACTIVITY", "MEAL", "RESTAURANT", "SPORT", "PARTY", "TRANSPORT", "EXCURSION", "OTHER"];

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



    return (
        <Screen className="bg-mist dark:bg-ink">
            <Animated.ScrollView style={{ flex: 1 }}>
                <View className="my-5 gap-2 px-5">
                    <Text className="text-2xl font-extrabold text-night dark:text-white" numberOfLines={3}>
                        Quel type d&apos;activité prévois-tu ?
                    </Text>
                    <Text className="text-sm text-gray-400" numberOfLines={5}>
                        Choisis un type pour mieux organiser le voyage — tu pourras toujours le changer plus tard.
                    </Text>
                </View>

                <View className="flex-row flex-wrap gap-3 px-4">
                    {eventType.map((eventType) => {
                        const selected = eventType === type;
                        return (
                            <Pressable
                                key={eventType}
                                onPress={() => setType(eventType)}
                                className={`w-[47%] rounded-2xl py-5 items-center border-2 ${selected
                                    ? "bg-amber/10 dark:bg-amber/20 border-amber"
                                    : "bg-white dark:bg-night border-mist dark:border-white/10"
                                    }`}>

                                {selected &&
                                    <Animated.View
                                        entering={FadeIn}
                                        className="absolute top-2 right-2 h-5 w-5 rounded-full bg-amber-deep items-center justify-center"
                                    >
                                        <IconSymbol name="checkmark" size={11} color="white" />
                                    </Animated.View>
                                }
                                <View className="h-18 w-18 rounded-full bg-amber/15 items-center justify-center">
                                    <EventIcon name={eventType} size="md" />
                                </View>
                                <Text className={`text-sm capitalize mt-2.5 ${selected ? "font-extrabold" : "font-semibold"} text-night dark:text-white`}>
                                    {toLabel({ type: eventType })}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View className="m-4">
                    <Button variant="contained"
                        title="Continuer"
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
                </View>
            </Animated.ScrollView>
        </Screen>
    )
}
