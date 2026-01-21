import { Button } from "@/components/ui/Button";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { default as styles } from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetDashboard, useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { translateRestriction } from "@/lib/userUtils";
import { ImageBackground } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

export default function ItemDetails() {

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));
    const { me, showMenu } = useContext(TripContext);


    const { data: dashboard } = useGetDashboard(String(id), String(me?._id), {
        enabled: (!!trip && !!me?._id)
    });
    const router = useRouter();


    const { formatDate } = useI18nTime();


    if (!trip)
        return (
            <Animated.ScrollView style={styles.container}>
                <View className="flex-row justify-between my-5 px-5">
                    <View className="flex w-40">
                        <Skeleton height={20} />
                    </View>

                    <View className="gap-1 justify-center">
                        <View className="w-40 items-center">
                            <Skeleton variant="circular" height={20} />
                        </View>
                        <Skeleton height={5} />
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
            <View className="h-80">
                <ImageBackground source={trip?.image}
                    style={{
                        height: "100%",
                        width: "100%",
                        // aspectRatio:"2.0"
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
                                <Pressable onPressOut={showMenu}
                                    className="bg-gray-800 rounded-full p-2">
                                    <IconSymbol name="ellipsis.circle" size={25} color="white" />
                                </Pressable>
                            </View>
                        </View>

                        <View>
                            <Text className="text-2xl text-white font-bold">
                                {trip?.name}
                            </Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
            <View className="flex flex-row justify-between items-center px-5 my-5">
                <View className="gap-1">
                    <Button onPress={() => router.push("./dates")} >
                        <CalendarDayView>
                            {!!trip?.startDate ? (
                                <View className="px-5 pb-2 flex items-center">
                                    <Text className="text-2xl">
                                        {formatDate(trip?.startDate, {
                                            day: "numeric",
                                            month: "long",
                                        })}
                                    </Text>
                                    <Text className="text-xl font-bold">-</Text>
                                    <Text className="text-2xl">
                                        {formatDate(trip?.endDate, {
                                            day: "numeric",
                                            month: "long"
                                        })}
                                    </Text>
                                </View>) :
                                (<Animated.View entering={ZoomIn} exiting={ZoomOut} >
                                    <View className="flex items-center m-1">
                                        <IconSymbol name="pencil" size={24} color="dark" />
                                        <Text className="text-sm">Ajouter des dates</Text>
                                    </View>
                                </Animated.View>)
                            }

                        </CalendarDayView>
                    </Button>
                </View>

                {/* <Button
                    className="flex items-center justify-center"
                    onPress={() => router.navigate({
                        pathname: "/[id]/(tabs)/settings",
                        params: {
                            id: String(id)
                        }
                    })}
                    onLongPress={() => router.push("./pick-user")}
                >
                    <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="lg" />
                    <Text className="font-bold text-lg dark:text-white">{me?.name}</Text>
                </Button> */}
            </View>



            <View className="gap-2 my-2">
                <View className="flex-row">
                    <IconSymbol name="map" size={34} color="grey" />
                    <Text className="flex-1 border-b border-gray-800  py-2 dark:text-white">
                        45 rue pouchet
                    </Text>
                </View>
                <View className="flex-row">
                    <IconSymbol name="person" size={34} color="grey" />
                    {/* <AvatarsGroup avatars={trip?.att} */}
                </View>
            </View>



            <View className="gap-2 flex-1">



                <View className="flex-row gap-2">
                    <Pressable className="rounded-lg bg-blue-100 dark:bg-gray-200 flex-1 p-2"
                        onPress={() => router.navigate({
                            pathname: "/[id]/votes",
                            params: {
                                id: String(id)
                            }
                        })}>
                        <View className="flex-row justify-between">
                            <View className="rounded-full bg-orange-400 dark:bg-blue-400 p-2">
                                <IconSymbol name="chart.bar.fill" size={40} color="black" />
                            </View>
                        </View>
                        <Text className="text-xl font-bold">Sondages</Text>
                        <Text className="text-xs italic">
                            Il n'y a présentement aucun sondage en cours
                        </Text>
                    </Pressable>

                    <Pressable className="rounded-lg bg-blue-100 dark:bg-gray-600 border border-gray-200 shadow flex-1 p-2"
                        onPress={() => router.navigate({
                            pathname: "/[id]/activities",
                            params: {
                                id: String(id)
                            }
                        })}>
                        <View className="flex-row justify-between">
                            <View className="rounded-full bg-orange-400 dark:bg-blue-400 p-2">
                                <IconSymbol name="calendar" size={40} color="black" />
                            </View>
                        </View>
                        <Text className="text-xl font-bold mb-2">Evenements</Text>
                        <View>
                            <Text className="text-sm italic">{dashboard?.events.attending} auquel tu participes</Text>
                            <Text className="text-sm italic">{dashboard?.events.ownership} dont tu es responsable</Text>
                            <Text className="text-sm italic">{dashboard?.events.total} au total</Text>
                        </View>
                    </Pressable>
                </View>


                <View className="flex-row gap-2">
                    <Pressable className="rounded-lg bg-orange-100 dark:bg-gray-200 flex-1 p-2"
                        onPress={() => router.push({
                            pathname: "/[id]/(tabs)/goods",
                            params: {
                                id: String(id)
                            }
                        })}>
                        <View className="flex-row justify-between">
                            <View className="rounded-full bg-blue-400 p-2">
                                <IconSymbol name="cart" size={40} color="black" />
                            </View>
                        </View>
                        <Text className="text-xl font-bold mb-2">La liste</Text>
                        <View>
                            <Text className="text-sm italic">{dashboard?.goods.missing} manquants</Text>
                            <Text className="font-bold">{dashboard?.goods.total} au total</Text>
                        </View>
                    </Pressable>

                    <Pressable className="rounded-lg bg-orange-100 dark:bg-gray-200 flex-1 p-2">
                        <View className="flex-row justify-between">
                            <View className="rounded-full bg-blue-400 p-2">
                                <IconSymbol name="person.circle" size={40} color="black" />
                            </View>
                        </View>
                        <Text className="text-xl font-bold">Participants</Text>
                        <View>
                            <Text className="text-xs italic">
                                {dashboard?.attendees.total} personnes ont déja rejoints
                            </Text>
                            <Text className="text-xs italic">
                                {dashboard?.attendees.restrictions?.length === 0 ? "Aucune restrictions" : dashboard?.attendees.restrictions?.map(translateRestriction).join(", ")}
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </View>

        </Animated.ScrollView>
    )

}

