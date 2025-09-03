import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";



export default function JoinTrip(){



    const {control} = useForm();


    const router = useRouter();

    return (
        <View>
            <View className="flex items-center mt-10 gap-1">
                <IconSymbol name="link" size={50} color="blue" />
                <Text className="text-xl font-bold dark:text-white">Rejoins un voyage</Text>

                <Text className="text-md text-center dark:text-gray-400">Demande aux autres participants le lien du voyage que tu souhaites rejoindre.</Text>
                <Text className="text-md text-center dark:text-gray-400">L'aventure commence maintenant</Text>
            
                
                <View className="flex flex-row flex-grow px-5 items-center gap-2 mt-5">
                    <FormText control={control} name="link" className="flex-grow" />
                    <IconSymbol name="doc.on.doc" color="blue" />
                </View>


                <View className="my-5">
                    <Button title="Rejoindre le voyage" onPress={() => router.replace({
                        pathname: '/[id]',
                        params: {id: "123"}
                    })}/>
                </View>
            </View>
        </View>
    )
    
}