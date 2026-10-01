import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTrip } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetStorageTrip, useUpdateStorageTrip } from "@/hooks/storage/useStorageTrips";
import { TripUser } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { Screen } from "@/components/ui/Screen";


export default function PickTripUserPage() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));

    const {me} = useTrip();

    const router = useRouter();

    const { data: storageTrip } = useGetStorageTrip(String(id));
    const updateStorageTrip = useUpdateStorageTrip(String(id));


    const onPress = async (item: TripUser) => {
        // Stockage lean v3 : on préserve les champs existants (token) et on pose le seat.
        // name/image ne sont plus stockés (affichage = hydrate batch).
        await updateStorageTrip.mutateAsync({
            _id: String(id),
            token: storageTrip?.token,
            user: item._id
        });
        router.dismissTo({
            pathname: "/[id]/settings/avatar",
            params: {
                id: String(id)
            }
        });
    }

    return (
        <Screen>
            <View>
                <Animated.FlatList
                    data={trip?.users}
                    renderItem={({ item }) =>
                        <Pressable className="flex-row justify-between items-center p-2"
                            onPress={async() => await onPress(item)}>
                            <View className="flex-row gap-2 items-center">
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
        </Screen>
    )
}
