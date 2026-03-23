import { AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LinearProgress } from "@/components/ui/LinearProgress";
import styles from "@/constants/Styles";
import { useGeocode } from "@/hooks/api/useGeocode";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useGetTrip, useUpdateTrip } from "@/hooks/api/useTrips";
import dayjs from "@/lib/dayjs-config";
import { countDaysBetween } from "@/lib/utils";
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInLeft, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TripLocation() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const updateTrip = useUpdateTrip(id);
    const { data: pagePoll } = useGetPolls(id, { type: "HousingPoll" });


    const [input, setInput] = useState<string>("");
    const router = useRouter();

    const [enableQuery, setEnableQuery] = useState<boolean>(false);

    const { data: geocode, isSuccess } = useGeocode(input, enableQuery);

    useEffect(() => {
        setEnableQuery(false);
    }, [setEnableQuery, input, isSuccess]);


    const { control, handleSubmit, reset, formState: { isDirty } } = useForm();
    useEffect(() => {
        reset(trip);
    }, [reset, trip]);


    const { field: { value: location, onChange }, fieldState: { isTouched } } = useController({
        control,
        name: "location"
    });


    const onSubmit = async (data) => {
        updateTrip.mutateAsync(data);
        router.dismissTo({
            pathname: "/[id]/(tabs)",
            params: {
                id: String(id)
            }
        })
    }

    const onMapClick = () => {
        const encodedDisplayName = encodeURIComponent(location.displayName);
        const longitude = location.coordinates[0];
        const latitude = location.coordinates[1];
        const url = `geo:${latitude},${longitude}?q=${latitude},${longitude}`
        Linking.openURL(url);
    }

    const now = dayjs();

    return (
        <SafeAreaView style={styles.container}>

            <Animated.ScrollView>
                <View className="">
                    <View className="gap-1">
                        <View className="flex-row bg-gray-200 dark:bg-gray-400 focus:border focus:border-blue-400 shadow items-center px-2 rounded-full">
                            <IconSymbol name="map" color="gray" />
                            <TextInput
                                value={input}
                                onChangeText={setInput}
                                className="flex-grow placeholder-black"
                                placeholder="Rechercher une addresse"
                            />
                            <Pressable onPress={() => setEnableQuery(true)}>
                                <IconSymbol name="paperplane.fill" color="black" />
                            </Pressable>
                        </View>
                        <View className="mx-4">
                            {geocode &&
                                <Animated.View
                                    entering={SlideInLeft}
                                    exiting={SlideOutRight}>
                                    <Pressable onPress={() => {
                                        onChange(geocode)
                                        setInput("");
                                    }}
                                        className="flex-row rounded-xl bg-white dark:bg-gray-900 items-center py-2">
                                        <IconSymbol name="map" color="gray" />
                                        <Text className="font-bold text-md max-w-[80%] dark:text-white" numberOfLines={4}>
                                            {geocode.displayName}
                                        </Text>
                                        <IconSymbol name="arrow.up.left" color="gray" />
                                    </Pressable>
                                </Animated.View>
                            }
                        </View>
                    </View>

                    <View className="gap-1 flex">
                        <Pressable
                            disabled={!location}
                            onPress={onMapClick}
                            className="flex border m-4 justify-center items-center h-[200] rounded-xl bg-white">
                            <Text>
                                {JSON.stringify(location)}
                            </Text>
                        </Pressable>
                        {isDirty &&
                            <Animated.View entering={FadeIn} exiting={FadeOut}>
                                <Button
                                    variant="contained"
                                    title="Modifier"
                                    onPress={handleSubmit(onSubmit)}
                                    isLoading={updateTrip.isPending}
                                />
                            </Animated.View>
                        }
                    </View>

                </View>

                {pagePoll?.totalResults !== 0 &&
                    <View className="gap-2 my-5">
                        <View>
                            <Text className="text-xl font-bold dark:text-white">
                                Sondage en cours
                            </Text>
                            <Text className="text-sm dark:text-gray-200">
                                Votes pour ton choix d'hébergement préféré
                            </Text>
                        </View>
                        {pagePoll?.polls.map(poll => (
                            <Pressable
                                key={poll._id}
                                onPress={() => router.navigate({
                                    pathname: "/[id]/polls/[pollId]",
                                    params: {
                                        id: String(id),
                                        pollId: poll._id
                                    }
                                })}
                                className="p-2 bg-white dark:bg-gray-900 rounded-xl">
                                <View className="flex-row justify-between">
                                    <View className="flex-row">
                                        <IconSymbol name="chart.bar.fill" color="orange" />
                                        <Text className="dark:text-white text-lg font-bold">
                                            {poll.question}
                                        </Text>
                                    </View>
                                    <Text className="text-orange-600 border border-orange-600 rounded-full px-2 bg-orange-200">
                                        {countDaysBetween(dayjs(poll.createdAt), now)}j
                                    </Text>
                                </View>
                                <View>
                                    {poll.options.slice(0, 3).map((option) =>
                                        <View className="gap-1 justify-start mt-2" key={option._id}>
                                            <View className="flex-row items-center justify-between ">
                                                <Text className="dark:text-white text-xs max-w-[80%] capitalize" numberOfLines={3}>
                                                    {option.title}                                                </Text>
                                                <Text className="font-bold text-orange-400">
                                                    {Number(option.percent).toFixed()} %
                                                </Text>
                                            </View>
                                            <LinearProgress progress={option.percent / 100} />
                                            <View className="flex-row items-center gap-5">
                                                {poll.isAnonymous ?
                                                    <Text className="text-gray-400">
                                                        {option.selectedBy?.length} votes
                                                    </Text>
                                                    :
                                                    <AvatarsGroup
                                                        avatars={option.selectedBy?.map(u => ({
                                                            avatar: u?.avatar,
                                                            alt: u?.name?.charAt(0)
                                                        }))}
                                                        size2="xs"
                                                        maxLength={5}
                                                    />
                                                }
                                            </View>
                                        </View>
                                    )}
                                </View>
                                <View className="flex-row justify-end my-2 items-center gap-2">
                                    <IconSymbol name="person.2.fill" color="gray" />
                                    <Text className="text-gray-400 ">
                                        {poll.hasSelected.length}
                                    </Text>
                                </View>
                                <View className="border-t border-gray-200">
                                    <Text className="dark:text-white text-center p-2">
                                        Voir tout
                                    </Text>

                                </View>
                            </Pressable>
                        ))}
                    </View>
                }


                {pagePoll?.totalResults === 0 &&
                    <Button
                        onPress={() => router.push({
                            pathname: "/[id]/polls/new",
                            params: {
                                id: String(id),
                                type: "HousingPoll"
                            }
                        })}
                        className="rounded-full bg-blue-400 py-4 flex-row justify-center items-center mx-5 mt-10">
                        <IconSymbol name="chart.bar.fill" color="white" />
                        <Text className="font-bold text-white">
                            Lancer un sondage
                        </Text>
                    </Button>

                }
            </Animated.ScrollView>
        </SafeAreaView>
    )
}