import { FormText } from "@/components/form/FormText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";



export default function JoinTrip(){



    const {control} = useForm();



    return (
        <View>


            <View className="flex items-center mt-10 gap-1">
                <IconSymbol name="link" size={50} color="blue" />
                <Text className="text-xl font-bold">Rejoins un voyage</Text>

                <Text className="text-md text-center">Demande aux autres participants le lien du voyage que tu souhaites rejoindre.</Text>
            
                
                <View className="flex flex-row flex-grow">
                    <FormText control={control} name="link" />
                </View>
            </View>
        </View>
    )
    
}