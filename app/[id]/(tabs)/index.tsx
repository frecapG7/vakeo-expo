import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LinearProgress } from "@/components/ui/LinearProgress";
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
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
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
        status: "OPEN"
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

                    {votePage?.totalResults === 0 &&

                        <Button variant="contained"
                            title="Voter"
                            onPress={() => router.navigate({
                                pathname: "/[id]/votes",
                                params: {
                                    id
                                }
                            })} />
                    }
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

            <View className="my-5 px-2">
                <View className="flex-row justify-between items-end">
                    <Text className="text-2xl dark:text-white font-bold pl-2">
                        Vote en cours
                    </Text>
                </View>
                {votePage?.votes?.filter(v => v.status === "OPEN").map((vote) => {

                    const progress = trip?.users.length > 0 ? vote.voters.length / trip.users.length : 0;
                    return (
                        <View key={vote._id} className="rounded-lg bg-orange-200 dark:bg-gray-200 p-2 ">
                            <View className="flex-row justify-between items-end">
                                <Text>Depuis 2 semaine</Text>
                                <Text className="font-bold ">{formatPercent(progress)}</Text>
                            </View>
                            <LinearProgress progress={progress} />
                            <Button onPress={() => router.navigate({
                                pathname: "/[id]/votes/[voteId]",
                                params: {
                                    id,
                                    voteId: vote._id
                                }
                            })}
                                className="bg-blue-400 rounded-lg items-center shadow-lg w-40 mt-1 self-center">
                                <Text className="uppercase align-center text-white font-bold">Voter</Text>
                            </Button>
                        </View>
                    );

                })}

            </View>


            <View className="mt-5 px-2">
                <View className="flex flex-row justify-between px-2">
                    <Text className="text-2xl dark:text-white font-bold">Prochaine activité</Text>
                    <Button onPress={() => console.log("todo")}>
                        <IconSymbol name="plus.circle" size={30} color={colors.text} />
                    </Button>
                </View>
                <View className="bg-orange-100 dark:bg-gray-100 rounded-lg p-2">
                    <Text className="text-md italic">Vous n'avez aucune activité à venir</Text>
                </View>
            </View>

            <View className="mt-5 px-2">
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

