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
                    contentFit="fill"
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


            <View className="shadow mx-4 -mt-10 mb-5 p-2 rounded-lg bg-yellow-50 dark:bg-gray-400 flex" >
                <View className="flex-row justify-between items-end px-5">
                    <Text className="text-3xl font-bold mb-5" numberOfLines={2}>{trip?.name}</Text>
                </View>
                <View className="flex-row ">
                    <View className="flex-1">
                        <Button className="flex-row items-center" onPress={() => router.push({
                            pathname: "/[id]/dates",
                            params: {
                                id: String(id)
                            }
                        })}>
                            <IconSymbol name="calendar" size={32} color="black" />
                            {trip?.startDate ?
                                <Text className="capitalize text-md" numberOfLines={2} >
                                    {formatRange(trip?.startDate, trip?.endDate)}
                                </Text>

                                :
                                <Text className="capitalize text-sm">
                                    A définir
                                </Text>
                            }
                        </Button>
                        <View className="h-0.5 w-80% rounded-xl bg-gray-800" />
                        <Button className="flex-row items-center" onPress={() => console.log("todo")}>
                            <IconSymbol name="map" size={32} color="black" />
                            <Text className="capitalize text-sm" numberOfLines={2} >
                                A définir
                            </Text>
                        </Button>

                    </View>

                </View>
            </View>

         



        </Animated.ScrollView>
    )

}

