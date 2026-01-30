import { Avatar, AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LinearProgress } from "@/components/ui/LinearProgress";
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
                            <View className="flex-row gap-5 items-center">
                                {/* <Pressable onPressOut={() => router.push({
                                    pathname: "/[id]/messages",
                                    params: {
                                        id: String(id)
                                    }
                                })}
                                    className="bg-gray-800 rounded-full p-2">
                                    <IconSymbol name="message" size={25} color="white" />
                                </Pressable> */}

                                <Pressable className="items-center"
                                    onPressOut={() => router.push({
                                        pathname: "/[id]/(tabs)/settings",
                                        params: {
                                            id: String(id)
                                        }
                                    })}>
                                    <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="md" />
                                    <Text className="text-white font-bold">{me?.name}</Text>
                                </Pressable>
                                <Pressable onPressOut={() => showMenu()}
                                    className="bg-gray-800 rounded-full p-2">
                                    <IconSymbol name="ellipsis.circle" color="white" />
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
                <View className="px-5 gap-2">
                    <Text className="text-3xl font-bold dark:text-white" numberOfLines={2}>{trip?.name}</Text>
                    <View className="flex gap-1 items-start justify-start">
                        {/* <View className="items-center">
                            <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="md" />
                            <Text className="dark:text-gray-400">{me?.name}</Text>
                        </View>
                        <View className="w-0.5 h-10 bg-gray-400" /> */}
                        <AvatarsGroup
                            maxLength={5}
                            size2="sm"
                            avatars={trip?.users?.filter(u => u._id !== me?._id).map(u => ({
                                avatar: u.avatar,
                                alt: u?.name.charAt(0)
                            })
                            )}
                        />
                        <Text numberOfLines={1} className="max-w-25 dark:text-white">Avec {trip?.users
                            ?.filter(u => u._id !== me?._id)
                            .map(u => u.name)
                            .join(",")}
                        </Text>
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
                    {/* <Button className="flex-row items-end border-b border-gray-400 p-1" onPress={() => console.log("todo")}>
                        <IconSymbol name="map" size={32} color="gray" />
                        <Text className="text-sm text-gray-400" numberOfLines={2} >
                            Saisir un lieu
                        </Text>
                    </Button> */}
                </View>

                <View>
                    <Text className="dark:text-white text-lg font-bold">
                        Lieu
                    </Text>
                    <View className="flex-row gap-2 items -end">
                        <Text className="dark:text-white">
                            Ajouter un lieu
                        </Text>
                        <View className="bg-blue-400 rounded-full">
                            <IconSymbol name="plus" color="black" />
                        </View>
                    </View>
                </View>
            </View>



            <View className="m-5 gap-2">

                <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-bold dark:text-white">
                        Sondages
                    </Text>
                    <View className="rounded-full bg-red-200 px-2 shadow">
                        <Text className="text-red-600 font-bold">
                            1 Actif
                        </Text>
                    </View>
                </View>

                <View className="p-2 rounded-xl bg-yellow-50 dark:bg-gray-900 shadow">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="font-bold dark:text-white">
                                Choix de la date
                            </Text>
                            <Text className="text-gray-400 text-sm">
                                Pour fixer le départ
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <IconSymbol name="clock" color="gray" size={16} />
                            <Text className="text-sm text-gray-400">J+2</Text>
                        </View>
                    </View>


                    <View className="gap-1 justify-start mt-2">
                        <View className="flex-row items-center justify-between ">
                            <Text className="dark:text-white">
                                12 - 14 Juillet
                            </Text>
                            <Text className="font-bold text-blue-600">
                                60%
                            </Text>
                        </View>
                        <LinearProgress progress={0.60} />
                        <View className="flex-row items-center gap-5">
                            <AvatarsGroup
                                avatars={trip?.users?.map(u => ({
                                    avatar: u.avatar,
                                    alt: u?.name.charAt(0)
                                }))}
                                size2="sm"
                                maxLength={5}
                            />
                            <Text className="text-gray-400">
                                3 votes
                            </Text>
                        </View>
                    </View>
                    <View className="gap-1 justify-start mt-2">
                        <View className="flex-row items-center justify-between">
                            <Text className="dark:text-white">
                                15 - 27 Juillet
                            </Text>
                            <Text className="font-bold text-gray-400">
                                40%
                            </Text>
                        </View>
                        <LinearProgress progress={0.40} disabled />
                        <View className="flex-row items-center gap-5">
                            <AvatarsGroup
                                avatars={trip?.users?.map(u => ({
                                    avatar: u.avatar,
                                    alt: u?.name.charAt(0)
                                }))}
                                size2="sm"
                                maxLength={5}
                            />
                            <Text className="text-gray-400">
                                2 votes
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="m-5 gap-2">
                <Text className="text-xl font-bold dark:text-white">
                    Cagnotte
                </Text>
                <View className="flex-row bg-yellow-50 dark:bg-gray-800 rounded-lg shadow p-5 justify-between items-center">
                    <View className="rounded-full bg-blue-200 items-center p-1">
                        <IconSymbol name="eurosign.circle" color="blue" />
                    </View>
                    <View>
                        <Text className="text-lg font-bold dark:text-white">
                            Consulter sur tricount
                        </Text>
                        <Text className="text-gray-400">
                            Equilibre les dépenses du groupe
                        </Text>
                    </View>
                    <IconSymbol name="arrow.up.right" color="gray" />
                </View>


            </View>
        </Animated.ScrollView>
    )

}

