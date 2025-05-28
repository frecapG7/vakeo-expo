import TripUsersPicker from "@/components/trips/TripUsersPicker";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetTrip } from "@/hooks/api/useTrips";
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



    return (
        <Animated.ScrollView style={{
            flex: 1,
            marginHorizontal: 20,
        }}>

            {/* <Pressable className="flex flex-row justify-between align-center" onPress={() => router.push(`/trips/${id}/dates`)}>
                <View className="flex flex-col justify-start items-start">
                    <Text className="text-xl font-bold">Dates du projet</Text>
                    {(trip?.startDate && trip?.endDate) &&
                        <Text className="text-lg text-gray-500 italic">{formatDate(trip?.startDate)} - {formatDate(trip?.endDate)}</Text>
                    }
                </View>


            </Pressable> */}

            <Pressable onPress={() => setShowUserPicker(true)} className="flex flex-row justify-between align-center py-5">
                <View className="flex gap-2 justify-start items-start">
                    <Text className="text-xl font-bold">Participants</Text>
                </View>
                <View className="flex flex-row gap-2 justify-center items-center">
                    <Text className="text-lg font-bold ">5</Text>
                    <IconSymbol name="person.circle" size={25} color="#000" />
                </View>
            </Pressable>

            <View className="flex flex-col gap-2 px-5">
                <Pressable onPress={() => router.push(`/trips/${id}/activities`)}
                    className="flex flex-row justify-between align-center p-5 rounded-lg bg-gray-400">
                    <View className="items-center flex flex-row gap-2 justify-start">
                        <IconSymbol name="flame" size={25} color="#000" />
                        <Text className="text-xl font-bold">Activités</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={25} color="#000" />
                </Pressable>

                <Pressable onPress={() => router.push(`/trips/${id}/housing`)}
                    className="flex flex-row justify-between align-center p-5 rounded-lg bg-gray-400">
                    <View className="items-center flex flex-row gap-2 justify-start">
                        {/* <IconSymbol name="bed.double" size={25} color="#000" /> */}
                        <Text className="text-xl font-bold">Menu</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={25} color="#000" />
                </Pressable>

                <Pressable onPress={() => router.push(`/trips/${id}/housing`)}
                    className="flex flex-row justify-between align-center p-5 rounded-lg bg-gray-400">
                    <View className="items-center flex flex-row gap-2 justify-start">
                        <IconSymbol name="cart" size={25} color="#000" />
                        <Text className="text-xl font-bold">Courses</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={25} color="#000" />
                </Pressable>

                <Pressable onPress={() => router.push(`/trips/${id}/links`)}
                    className="flex flex-row justify-between items-center p-5 rounded-lg bg-gray-400">
                    <View className="items-center flex flex-row gap-2 justify-start">
                        <IconSymbol name="link" size={25} color="#000" />
                        <View className="flex flex-col gap-1">
                            <Text className="text-xl font-bold">Liens utiles</Text>
                            <Text className="text-sm italic">Air B&B, Tricount etc...</Text>
                        </View>
                    </View>
                    <IconSymbol name="chevron.right" size={25} color="#000" />
                </Pressable>


            </View>
            <TripUsersPicker isVisible={showUserPicker}
                onClose={() => setShowUserPicker(false)}
                onSelect={(user) => {
                    setMe(user);
                    setShowUserPicker(false);
                }}
                options={trip?.users}
                value={me} />
        </Animated.ScrollView>
    )

}