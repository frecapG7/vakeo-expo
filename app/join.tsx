import { FormLink } from "@/components/form/FormLink";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinTrip() {

    const { control, handleSubmit } = useForm({
        defaultValues: {
            value: ""
        }
    });

    const router = useRouter();

    // Le POST /token/verify v1 est mort (Q3) : la vérification vit dans l'écran de
    // résolution (GET /v3/token/:value), poussé avec la valeur extraite du lien.
    const onSubmit = (data: { value?: string }) => {
        // Le pattern accepte un slash final : filter(Boolean) évite le segment vide,
        // qui laissait le bouton en no-op silencieux (retour sans navigation).
        const token = data?.value?.split("/").filter(Boolean).pop();
        if (!token)
            return;
        router.push({
            pathname: '/token/[token]',
            params: {
                token
            }
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View className="flex items-center mt-10 gap-5">
                <View className="w-20 h-20 rounded-full bg-amber/15 justify-center items-center mb-2">
                    <IconSymbol name="link" size={40} color="#EE8B33" />
                </View>
                <Text className="text-2xl font-bold text-night dark:text-white text-center mb-2">
                    Rejoindre un voyage
                </Text>
                <Text className="text-sm text-night/50 dark:text-white/50 text-center mb-8">
                    Collez le lien pour rejoindre l&apos;aventure
                </Text>

                {/* Le joinToken v3 est un JWT : la valeur contient des points (header.payload.signature). */}
                <FormLink
                    control={control}
                    name="value"
                    required
                    placeholder="vakeoexpo://token/..."
                    pattern={/^(?:https?:\/\/[^/\s]+\/token|vakeoexpo:\/\/token)\/[A-Za-z0-9_.-]+\/?$/}
                />
                <View className="m-5">
                    <Button title="Rejoindre le voyage"
                        variant="contained"
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
            </View>
        </SafeAreaView >
    )

}
