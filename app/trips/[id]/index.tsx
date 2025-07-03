import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useStyles } from "@/hooks/styles/useStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function ItemDetails() {

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));


    const router = useRouter();


    const [showUserPicker, setShowUserPicker] = useState(false);


    const [me, setMe] = useState({
        id: 1,
        name: "John Doe",
    });
    const { container } = useStyles();



    return (
        <Animated.ScrollView style={container}>
            <View className="flex flex-grow flex-col gap-5 p-4">

                <Pressable onPress={() => router.push(`/trips/${id}/activities`)}
                    className="flex flex-row justify-between align-center p-5 rounded-lg bg-primary-400 ring-secondary ring-2">
                    <View className="items-center flex flex-row gap-2 justify-start">
                        <IconSymbol name="flame" size={25} color="#000" />
                        <Text className="text-xl font-bold text-secondary">Activités</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={25} color="#000" />
                </Pressable>

                <Pressable onPress={() => router.push(`/trips/${id}/meals`)}
                    className="flex flex-row justify-between align-center p-5 rounded-lg bg-primary-400 ring-secondary ring-2">
                    <View className="items-center flex flex-row gap-2 justify-start">
                        <IconSymbol name="suit.spade" size={25} color="#000" />
                        <Text className="text-xl font-bold text-secondary">Menu</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={25} color="#000" />
                </Pressable>

                <Pressable onPress={() => router.push(`/trips/${id}/groceries`)}
                    className="flex flex-row justify-between align-center p-5 rounded-lg bg-primary-400 ring-secondary ring-2">
                    <View className="items-center flex flex-row gap-2 justify-start">
                        <IconSymbol name="cart" size={25} color="#000" />
                        <Text className="text-xl font-bold text-secondary">Courses</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={25} color="#000" />
                </Pressable>

                <Pressable onPress={() => router.push(`/trips/${id}/links`)}
                    className="flex flex-row justify-between items-center p-5 rounded-lg bg-primary-400 ring-secondary ring-2">
                    <View className="items-center flex flex-row gap-2 justify-start">
                        <IconSymbol name="link" size={25} color="#000" />
                        <View className="flex flex-col gap-1">
                            <Text className="text-xl font-bold text-secondary">Liens utiles</Text>
                        </View>
                    </View>
                    <IconSymbol name="chevron.right" size={25} color="#000" />
                </Pressable>


            </View>


        </Animated.ScrollView>
    )

}