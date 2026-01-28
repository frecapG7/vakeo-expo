import { Avatar, AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { default as styles } from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { ImageBackground } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

export default function ItemDetails() {

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));
    const { me, showMenu } = useContext(TripContext);

    // const { data: dashboard } = useGetDashboard(String(id), String(me?._id), {
    //     enabled: (!!trip && !!me?._id)
    // });
    const router = useRouter();

    const { formatDate, formatRange } = useI18nTime();

    if (!trip || !router)
        return (
            <Animated.ScrollView style={styles.container}>
                <View className="h-80 bg-gray-600">
                </View>

                <View className="shadow mx-4 -mt-10 bg-yellow-50 dark:bg-gray-400 rounded-lg p-2 pb-10">
                    <View className="flex w-40">
                        <Skeleton height={20} />
                    </View>
                </View>
                <View className="mt-10 gap-5">
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                </View>
            </Animated.ScrollView>
        );

    return (
        <Animated.ScrollView style={{ flex: 1 }}>
            <View className="h-80 w-full">
                <ImageBackground source={trip?.image}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    contentFit="cover"
                >
                    <View className="flex-1 justify-between mt-10 p-2">
                        <View className="flex-row justify-between items-center">
                            <Pressable className="rounded-full bg-gray-800 p-1 shadow"
                                onPress={() => router.dismissAll()}>
                                <IconSymbol name="chevron.left" size={25} color="white" />
                            </Pressable>
                            <View className="flex-row gap-2">
                                <Pressable onPressOut={() => router.push({
                                    pathname: "/[id]/messages",
                                    params: {
                                        id: String(id)
                                    }
                                })}
                                    className="bg-gray-800 rounded-full p-2">
                                    <IconSymbol name="message" size={25} color="white" />
                                </Pressable>
                                <Pressable onPressOut={() => showMenu()}
                                    className="bg-gray-800 rounded-full p-2">
                                    <IconSymbol name="ellipsis.circle" size={25} color="white" />
                                </Pressable>
                            </View>
                        </View>

                        {/* <View>
                            <Text className="text-2xl text-white font-bold">
                                {trip?.name}
                            </Text>
                        </View> */}
                    </View>
                </ImageBackground>
            </View>


            <View className="shadow mx-4 -mt-10 mb-5 p-2 rounded-lg bg-yellow-50 dark:bg-gray-900 flex" >
                <View className="px-5">
                    <Text className="text-3xl font-bold dark:text-white" numberOfLines={2}>{trip?.name}</Text>
                    <View className="flex-row gap-2 items-center justify-start">
                        <View className="items-center">
                            <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="md" />
                            <Text className="dark:text-gray-400">{me?.name}</Text>
                        </View>
                        <View className="w-0.5 h-10 bg-gray-400" />
                            <AvatarsGroup
                                maxLength={5}
                                size2="sm"
                                avatars={trip?.users?.filter(u => u._id !== me?._id).map(u => ({
                                    avatar: u.avatar,
                                    alt: u?.name.charAt(0)
                                })
                                )} />
                    </View>
                </View>
                <View className="flex my-5 gap-2">
                    <Button className="flex-row items-end border-b gap-2 border-gray-400 p-1" onPress={() => router.push({
                        pathname: "/[id]/dates",
                        params: {
                            id: String(id)
                        }
                    })}>
                        <IconSymbol name="calendar" size={32} color="gray" />
                        {trip?.startDate ?
                            <Text className="capitalize text-md text-gray-400" numberOfLines={2} >
                                {formatRange(trip?.startDate, trip?.endDate)}
                            </Text>
                            :
                            <Text className="capitalize text-sm text-gray-400">
                                Saisir des dates
                            </Text>
                        }
                    </Button>
                    <Button className="flex-row items-end border-b border-gray-400 p-1" onPress={() => console.log("todo")}>
                        <IconSymbol name="map" size={32} color="gray" />
                        <Text className="text-sm text-gray-400" numberOfLines={2} >
                            Saisir un lieu
                        </Text>
                    </Button>
                </View>
            </View>
        </Animated.ScrollView>
    )

}

