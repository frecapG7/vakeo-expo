import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { HousingOptions } from "@/components/polls/HousingOptions";
import { PollOption } from "@/components/polls/PollOption";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetPoll, useUnvotePoll, useVotePoll } from "@/hooks/api/usePolls";
import useI18nNumbers from "@/hooks/i18n/useI18nNumbers";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function PollDetailsPage() {
    const { id, pollId } = useLocalSearchParams();


    const { me } = useContext(TripContext);
    const { data: poll } = useGetPoll(id, pollId);

    const votePoll = useVotePoll(id, pollId);
    const unvotePoll = useUnvotePoll(id, pollId);

    const { formatDuration } = useI18nTime();

    const { formatPercent } = useI18nNumbers();

    const [selectedOption, setSelectedOption] = useState(null);

    const handleClick = async (option: any, includeMe: boolean) => {
        if (includeMe)
            unvotePoll.mutateAsync({
                option: option?._id,
                user: me
            })
        else
            await votePoll.mutateAsync({
                options: [option?._id],
                user: me
            });

    }



    if (!poll)
        return (
            <View style={styles.container}>
                <View className="flex-row gap-2 items-center">
                    <Skeleton variant="circular" />
                    <View className="w-40">
                        <Skeleton height={5} />

                    </View>
                </View>
                <View className="gap-5 my-5">
                    <Skeleton height={40} />
                    <Skeleton height={40} />
                    <Skeleton height={40} />

                </View>

            </View>
        );



    return (
        <Animated.ScrollView style={styles.container}>

            <View className="flex-row gap-2 items-center my-2">
                <Avatar src={poll?.createdBy?.avatar}
                    alt={poll?.createdBy?.name?.charAt(0)}
                    size2="md"
                />
                <View>
                    <Text className="font-bold text-lg dark:text-white">
                        {poll?.createdBy?.name}
                    </Text>
                    <Text className="dark:text-white">{formatDuration(poll?.createdAt)}</Text>
                </View>
            </View>

            <View className="m-2 mb-10 rounded-xl p-2 border border-gray-200">
                <View className="mb-5">
                    <Text className="text-xl font-bold dark:text-white">
                        {poll?.question}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-lg">
                        {poll?.hasSelected.length} votes
                    </Text>
                </View>



                {poll?.type === "HousingPoll" &&
                    <View className="mb-5">
                        <HousingOptions
                            poll={poll}
                            user={me}
                            onVote={(option) => handleClick(option, false)}
                            onUnVote={(option) => handleClick(option, true)}
                            onSelected={(option) => setSelectedOption(option)} />
                    </View>
                }
                {poll?.type !== "HousingPoll" &&

                    <View className="gap-5 mb-5">
                        {poll?.options?.map((option) => {
                            const includeMe = option?.selectedBy?.map(u => u._id).includes(me?._id);
                            // const percent = Math.round(getPercent(option?.selectedBy?.length, poll?.hasSelected.length) * 100);
                            return (
                                <Button
                                    disabled={poll?.isClosed || votePoll?.isPending}
                                    key={option?._id}
                                    onPress={() => handleClick(option, includeMe)}
                                    onLongPress={() => setSelectedOption(option)}
                                >
                                    <PollOption label={option.value}
                                        selectedBy={option.selectedBy}
                                        percent={option.percent}
                                        isAnonymous={poll.isAnonymous}
                                        includeUser={includeMe}
                                    />
                                </Button>
                            );

                        })}
                    </View>
                }


                <View className="flex-row justify-between items-center my-2">
                    <View className="flex-row items-center">
                        <View className="flex-row -gap-1">
                            <IconSymbol name="checkmark.circle.fill" color="gray" size={16} />
                            {!poll?.isSingleAnswer &&
                                <View className="-ml-1.5">
                                    <IconSymbol name="checkmark.circle.fill" color="gray" size={16} />
                                </View>
                            }
                        </View>
                        <Text className="text-xs text-gray-500">
                            Séléctionne {poll?.isSingleAnswer ? "une option" : "plusieurs options"}
                        </Text>
                    </View>



                    <View className="flex-row gap-1 items-center" >
                        <IconSymbol name={poll?.isAnonymous ? "eye.slash" : "eye"} color="gray" size={16} />
                        <Text className="text-gray-500 text-xs">
                            Vote {poll?.isAnonymous ? "anonyme" : "public"}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="mb-20 px-5">
                <Pressable
                    className="rounded-full bg-blue-400 py-4 flex items-center">
                    <Text className="text-white font-bold">Modifier</Text>
                </Pressable>
            </View>



            <PickUsersModal open={!!selectedOption && !poll.isAnonymous}
                onClose={() => setSelectedOption(null)}
                users={selectedOption?.selectedBy}
                disabled
                title="Votants"
            />
        </Animated.ScrollView>
    )


}