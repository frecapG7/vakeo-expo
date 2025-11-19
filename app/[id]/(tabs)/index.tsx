import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { VoteListItem } from "@/components/votes/VoteListItem";
import Styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetVotes } from "@/hooks/api/useVotes";
import useI18nNumbers from "@/hooks/i18n/useI18nNumbers";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInDown, ZoomIn, ZoomOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


const mockGroceries = [
    {
        _id: '213413654156346465',
        value: "William Peel",
        author: {
            _id: '13413135143',
            avatar: '',
            name: 'Tomat'
        }
    },
    {
        _id: '256344654444354',
        value: "Sauce tomate (x2)",
        author: {
            _id: '13413135143',
            avatar: '',
            name: 'Tomat'
        }
    },

]

export default function ItemDetails() {

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));

    const { data: votePage } = useGetVotes(id, {
        status: "OPEN",
        limit: 3
    });
    const router = useRouter();

    const { me } = useContext(TripContext);

    const { formatDate } = useI18nTime();
    const { formatPercent } = useI18nNumbers();

    const colors = useColors();



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
                    <Text className="text-2xl dark:text-white font-bold">Votes</Text>
                </View>
                {votePage?.totalResults === 0 &&
                    <Animated.View entering={SlideInDown}
                        exiting={SlideInDown}
                        className="flex-row items-end justify-between">
                        <Text className="dark:text-white">Ajouter un vote ?</Text>
                        <View className="flex-row items-center gap-2">
                            <Button className="border bg-blue-400 rounded-full p-1"
                                onPress={() => router.navigate({
                                    pathname: "/[id]/votes/new?type=DATES",
                                    params: {
                                        id,
                                    },

                                })}>
                                <IconSymbol name="calendar" color={colors.text} />
                            </Button>
                            <Button className="border bg-blue-400 rounded-full p-1"
                                onPress={() => console.log("TODO")}>
                                <IconSymbol name="house.fill" color={colors.text} />
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

            <View className="px-2">
                <Text className="text-2xl dark:text-white font-bold">Maison</Text>
                {/* <IconSymbol name="house.fill" size={34} color="white" /> */}
                {!trip?.housing &&
                    <Animated.View className="" >
                        <Text className="font-bold text-md dark:text-white">
                            Vous n'avez pas encore ajouté de maison
                        </Text>
                    </Animated.View>
                }
            </View>




            <View className="mt-20 px-2">
                <View className="flex flex-row justify-between px-2">
                    <Text className="text-2xl dark:text-white font-bold">Courses</Text>
                    <Button onPress={() => console.log("todo")}>
                        <IconSymbol name="plus.circle" size={30} color={colors.text} />
                    </Button>
                </View>

                <Animated.FlatList
                    data={mockGroceries}
                    renderItem={({ item }) => (
                        <View className="flex flex-row">
                            <Text>{item.value}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item._id}
                    keyboardDismissMode="on-drag"
                    className="bg-orange-100 dark:bg-gray-100 rounded-lg p-2"
                />
            </View>

            {/* 
            <View className="mt-10">
                <Text className="text-2xl ">A venir</Text>
                <View className="flex flex-row justify-between bg-gray-200 py-2 rounded-lg">
                    <View className="flex flex-row gap-2 items-center">
                        <IconSymbol name="flame" size={35} />
                        <View>
                            <Text className="text-lg">10h-12h</Text>
                            <Text className="text-lg italic">Piscine</Text>
                        </View>
                    </View>

                    <AvatarsList users={[
                        {
                            id: "1",
                            name: "Florian"
                        }, {
                            id: "213454",
                            name: "Coumba"
                        }
                    ]} />
                </View>
            </View> */}

        </SafeAreaView>

    )

}

