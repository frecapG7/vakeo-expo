import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useUpdateStorageTrip } from "@/hooks/storage/useStorageTrips";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function PickTripUserPage() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));

    const {me} = useContext(TripContext);

    const router = useRouter();

    const updateStorageTrip = useUpdateStorageTrip(String(id));


    const onPress = async (item) => {
        await updateStorageTrip.mutateAsync({
            _id: trip?._id,
            name: trip?.name,
            image: trip?.image,
            user: item._id
        });
        router.dismissTo({
            pathname: "/[id]/(tabs)/settings",
            params: {
                id: String(id)
            }
        });
    }

    return (
        <SafeAreaView>
            <View>
                <Animated.FlatList
                    data={trip?.users}
                    renderItem={({ item }) =>
                        <Pressable className="flex flex-row justify-between items-center p-2"
                            onPress={async() => await onPress(item)}>
                            <View className="flex flex-row gap-2 items-center">
                                <Avatar alt={item.name.charAt(0)} size2="sm" src={item.avatar} />
                                <Text className="text-lg ">{item.name}</Text>
                            </View>
                            {item._id === me?._id && <IconSymbol name="checkmark.circle.fill" size={35} color="blue" />}
                        </Pressable>
                    }
                    keyExtractor={(item) => item._id}
                    contentContainerClassName="mx-5 bg-orange-100 dark:bg-gray-100 rounded-lg"
                    ItemSeparatorComponent={() => <View className="h-0.5 bg-black dark:bg-white" />}
                />
            </View>
        </SafeAreaView>
    )
}