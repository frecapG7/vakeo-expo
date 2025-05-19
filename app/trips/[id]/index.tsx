import TripUsersPicker from "@/components/trips/TripUsersPicker";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function ItemDetails() {

    const { id } = useLocalSearchParams();
    const { data: trip, isSuccess } = useGetTrip(String(id));


    const router = useRouter();
    const { formatDate } = useI18nTime();


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

            <View className="flex flex-col gap-2 divide-y divide-solid divide-white">

                <Pressable className="flex flex-row justify-between align-center py-5" onPress={() => router.push(`/trips/${id}/dates`)}>
                    <View className="flex flex-col justify-start items-start">
                        <IconSymbol name="calendar" size={25} color="#000" />
                        <Text className="text-xl font-bold">Dates du projet</Text>
                    </View>

                    {trip?.author === me.id &&
                        <View className="items-center my-auto">
                            {(trip?.startDate && trip?.endDate) &&
                                <Text className="text-lg text-gray-500 italic">{formatDate(trip?.startDate)} - {formatDate(trip?.endDate)}</Text>
                            }
                        </View>
                    }

                </Pressable>

                <Pressable onPress={() => setShowUserPicker(true)} className="flex flex-row justify-between align-center py-5">
                    <View className="flex gap-2 justify-start items-start">
                        <Text className="text-xl font-bold">Participants</Text>
                    </View>
                    <View className="flex flex-row gap-2 justify-center items-center">
                        <Text className="text-lg font-bold ">5</Text>
                        <IconSymbol name="person.circle" size={25} color="#000" />
                    </View>
                </Pressable>


                <Pressable onPress={() => router.push(`/trips/${id}/activities`)} className="flex flex-row justify-between align-center py-5">
                    <View className="items-center">
                        <IconSymbol name="flame" size={25} color="#000" />
                        <Text className="text-xl font-bold">Activités</Text>
                    </View>
                </Pressable>

                <Pressable onPress={() => router.push(`/trips/${id}/housing`)} className="flex flex-row justify-between align-center py-5">
                    <View className="items-center">
                        <IconSymbol name="bed.double" size={25} color="#000" />
                        <Text className="text-xl font-bold">Hébergement</Text>
                    </View>
                </Pressable>


                <Pressable onPress={() => router.push(`/trips/${id}/budget`)} className="flex flex-row justify-between align-center py-5">
                    <View className="items-center">
                        <IconSymbol name="eurosign.circle" size={25} color="#000" />
                        <Text className="text-xl font-bold">Dépenses</Text>
                    </View>

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