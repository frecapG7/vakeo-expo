import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useStyles } from "@/hooks/styles/useStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function TripPickUser() {


    const { container } = useStyles();

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);

    const [me, setMe] = useState({
        id: 1,
        name: "John Doe",
    });


    const router = useRouter();

    return (
        <Animated.ScrollView style={container}>

            <Pressable className="p-2" onPress={() => router.back()}>
                <Text className="text-secondary">Annuler</Text>
            </Pressable>

            <Text className="text-xl text-center font-bold mb-2 text-secondary">Sélectionne qui tu es</Text>

            <View className="flex flex-col mx-10 bg-gray-400 rounded-lg divide-solid divide-white gap-1">
                {trip?.users.map((option) => (
                    <Pressable key={option.id} className="flex flex-row justify-between items-center p-2" onPress={() => {
                        setMe(option)
                        router.back();
                    }}>
                        <View className="flex flex-row gap-2 items-center">
                            <Avatar alt={option.name.charAt(0)} size={40} color="blue" />
                            <Text className="text-lg ">{option.name}</Text>
                        </View>

                        {option.id === me?.id && <IconSymbol name="checkmark.circle.fill" size={35} color="blue" />}
                    </Pressable>
                ))}
            </View>
        </Animated.ScrollView>
    )


}