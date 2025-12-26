import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LinearProgress } from "@/components/ui/LinearProgress";
import { Skeleton } from "@/components/ui/Skeleton";
import { VoteListItem } from "@/components/votes/VoteListItem";
import { default as styles, default as Styles } from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetGoodsCount } from "@/hooks/api/useGoods";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetVotes } from "@/hooks/api/useVotes";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { getPercent } from "@/lib/voteUtils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, ZoomIn, ZoomOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ItemDetails() {

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));

    const { data: votePage } = useGetVotes(id, {
        status: "OPEN",
        limit: 3
    });
    const { data: goodsCount } = useGetGoodsCount(id);
    const router = useRouter();

    const { me } = useContext(TripContext);

    const { formatDate } = useI18nTime();


    if (!trip)
        return (
            <SafeAreaView style={styles.container}>

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

            </SafeAreaView>
        );


    return (
        <SafeAreaView style={Styles.container}>
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

                <Button
                    className="flex items-center justify-center"
                    onPress={() => router.push("./edit-user")}
                    onLongPress={() => router.push("./pick-user")}
                >
                    <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="lg" />
                    <Text className="font-bold text-lg dark:text-white">{me?.name}</Text>
                </Button>
            </View>

            <Animated.View entering={FadeIn}
                exiting={FadeOut}
                className="my-5 px-2 rounded-lg p-1 pb-5">

                <View>
                    <Text className="text-2xl dark:text-white font-bold">Sondage</Text>
                </View>
                {votePage?.totalResults === 0 &&
                    <Animated.View entering={SlideInDown}
                        exiting={SlideOutDown}
                        className="flex-row items-end px-1 py-2 justify-between bg-orange-200 dark:bg-gray-200 rounded-lg">
                        <View>
                            <Text className="text-lg">Aucun sondage en cours</Text>
                        </View>
                        <View className="flex-row items-center gap-2 ">
                            <Button className="border bg-blue-400 rounded-full p-1"
                                onPress={() => router.navigate({
                                    pathname: "/[id]/votes/new?type=DATES",
                                    params: {
                                        id,
                                    },

                                })}>
                                <IconSymbol name="calendar" color="black" size={24} />
                            </Button>
                            <Button className="border bg-blue-400 rounded-full p-1"
                                onPress={() => console.log("TODO")}>
                                <IconSymbol name="house.fill" color="black" />
                            </Button>
                        </View>
                    </Animated.View>

                }

                {votePage?.votes?.map((vote) =>
                    <View key={vote._id}>
                        <VoteListItem
                            vote={vote}
                            trip={trip}
                            user={me}
                            onClick={() =>
                                router.push({
                                    pathname: "/[id]/votes/[voteId]",
                                    params: {
                                        id,
                                        voteId: vote._id
                                    }
                                })
                            } />
                    </View>
                )}

            </Animated.View>

            <View className="mt-5 px-2">
                <View className="flex flex-row justify-between">
                    <Text className="text-2xl dark:text-white font-bold">Courses</Text>
                </View>
                <View className="bg-orange-200 dark:bg-gray-200 p-2 rounded-lg">
                    {goodsCount?.totalCount > 0 ?

                        <View>
                            <View className="items-end flex-row justify-end gap-2">
                                <IconSymbol name="cart" color="black" />
                                <Text className="text-lg font-bold">{goodsCount?.checkedCount} / {goodsCount?.totalCount}</Text>
                            </View>
                            <LinearProgress progress={getPercent(goodsCount?.checkedCount, goodsCount?.totalCount)} />
                        </View>
                        :
                        <Text>Vous n'avez aucune courses à faire</Text>
                    }
                </View>


            </View>
        </SafeAreaView>

    )

}

