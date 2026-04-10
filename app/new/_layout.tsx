import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { Stack, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function NewTripLayout() {



    const methods = useForm({
        defaultValues: {
            name: "",
            description: "",
            users: [{
                name: "Moi",
            }, {
                name: "",
            }],
            isPrivate: false
        }
    });


    const router = useRouter();


    return (
        <SafeAreaView style={styles.container}>

            <FormProvider {...methods}>
                <Stack screenOptions={{
                    headerShown: true
                }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="setup-general"
                        options={{
                            headerLeft: () => (
                                <View className="flex-row items-center">
                                    <Button onPress={() => router.dismissAll()}>
                                        <IconSymbol name="arrow.left" color="gray" />
                                    </Button>
                                    <Chip text="1 sur 2" size="small" />
                                </View>
                            ),
                            title: "Nouvelle escapade"
                        }}
                    />
                    <Stack.Screen name="setup-users"
                        options={{
                            headerLeft: () => (
                                <View className="flex-row items-center">
                                    <Button onPress={() => router.dismissTo({
                                        pathname: "/new/setup-general"
                                    })}>
                                        <IconSymbol name="arrow.left" color="gray" />
                                    </Button>
                                    <Chip text="2 sur 2" size="small" />
                                </View>
                            ),
                            title: "Nouvelle escapade"
                        }} />
                </Stack>
            </FormProvider>
        </SafeAreaView>
    )
}