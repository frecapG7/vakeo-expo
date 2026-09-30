import { TripInfoForm } from "@/components/trips/TripInfoForm";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import styles from "@/constants/Styles";
import { Trip } from "@/types/models";
import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function NewTripGeneral() {

    const { control, trigger } = useFormContext<Trip>();

    const router = useRouter();

    return (
        <Screen style={styles.container}>
            <KeyboardAvoidingView behavior="padding"
                keyboardVerticalOffset={64}
                style={styles.container}>
                <Animated.ScrollView className="flex-1">
                    <View className="gap-2 m-2">
                        <Text className="text-h1 text-night dark:text-white">
                            Donne un nom à ton escapade
                        </Text>
                        <Text className="text-sm text-night/70 dark:text-white/60">
                            Indique un nom d&apos;escapade qui décrit ce que tu as en tête.
                            Tu peux également ajouter une description et personnaliser le thème.
                        </Text>
                    </View>
                    <View className="flex-1 m-5">
                        <TripInfoForm control={control} />
                    </View>

                    <View className="my-4">
                        <Button variant="contained"
                            size="medium"
                            title="Continuer"
                            onPress={async () => {
                                const valid = await trigger(["name", "description", "image"]);
                                if (valid)
                                    router.push({
                                        pathname: "/new/setup-users"
                                    })
                            }}>

                        </Button>
                    </View>
                </Animated.ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    )
}
