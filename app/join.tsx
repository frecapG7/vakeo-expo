import { FormLink } from "@/components/form/FormLink";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useVerifyToken } from "@/hooks/api/useTokens";
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


    const verifyToken = useVerifyToken()
    const onSubmit = async (data: any) => {
        const parts = data?.value?.split("/");
        const token = parts[parts.length - 1];

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
                <View className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 justify-center items-center mb-2">
                    <IconSymbol name="link" size={40} color="blue" />
                </View>
                <Text className="text-2xl font-bold dark:text-white text-center mb-2">
                    Rejoindre un voyage
                </Text>
                <Text className="text-md text-gray-500 dark:text-gray-400 text-center mb-8">
                    Collez le lien pour rejoindre l'aventure
                </Text>

                <FormLink
                    control={control}
                    name="value"
                    required
                />
                <View className="m-5">
                    <Button title="Rejoindre le voyage"
                        variant="contained"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={verifyToken.isPending}
                    />
                </View>
            </View>
        </SafeAreaView >
    )

}