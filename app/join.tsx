import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useVerifyToken } from "@/hooks/api/useTokens";
import * as Clipboard from 'expo-clipboard';
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export default function JoinTrip() {

    const { control, handleSubmit, setValue, reset } = useForm();

    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<String>();

    const verifyToken = useVerifyToken()
    const onSubmit = async (data) => {
        try{
            const parts = data?.value?.split("/");
            const token = parts[parts.length -1];
            const response = await verifyToken.mutateAsync(token);
            setErrorMessage(''); 
            router.push({
                pathname: '/token/[token]',
                params: {
                    token
                }
            });
            reset();
        }catch(error){
            setErrorMessage("Ce lien n'est plus valide")
            
        }
    }


    return (
        <SafeAreaView style={styles.container}>

            <View className="flex items-center mt-10 gap-5">
                <View className="flex items-center">
                    <IconSymbol name="link" size={50} color="blue" />
                    <Text className="text-xl font-bold dark:text-white">Rejoins un voyage</Text>

                </View>
                <View>
                    <Text className="text-md text-center dark:text-gray-400">Demande aux autres participants le lien du voyage que tu souhaites rejoindre.</Text>
                    <Text className="text-md text-center dark:text-gray-400">L'aventure commence maintenant</Text>
                </View>


                <View className="flex flex-row flex-grow px-5 items-center gap-2 mt-5 p-2">
                    <FormText control={control}
                        name="value"
                        className="flex-grow"
                        rules={{
                            required: true,
                            pattern: urlRegex
                        }} />
                    <Button onPress={async () => {
                        const text = await Clipboard.getStringAsync();
                        if (urlRegex.test(text))
                            setValue("value", text);
                    }} >
                        <IconSymbol name="doc.on.doc" color="blue" />
                    </Button>
                </View>


                <View className="my-5">
                    <Button title="Rejoindre le voyage"
                        variant="contained"
                        onPress={handleSubmit(onSubmit)}
                        className="w-lg"
                        isLoading={verifyToken.isPending}
                    />
                </View>
            </View>
        </SafeAreaView >
    )

}