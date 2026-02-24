import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { Avatar, AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetPoll, useUnvotePoll, useVotePoll } from "@/hooks/api/usePolls";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { getPercent } from "@/lib/voteUtils";
import { useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { Text, View } from "react-native";


const getColorForPercent = (percent) => {
    // Couleurs de départ et d'arrivée (orange clair → orange foncé)
    const startColor = { r: 254, g: 215, b: 170 }; // #FED7AA
    const endColor = { r: 234, g: 88, b: 12 };    // #EA580C

    // Interpolation linéaire pour chaque composante RGB
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * (percent / 100));
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * (percent / 100));
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * (percent / 100));

    return `rgb(${r}, ${g}, ${b})`;
}



export default function PollDetailsPage() {


    const { id, pollId } = useLocalSearchParams();


    const { me } = useContext(TripContext);
    const { data: poll } = useGetPoll(id, pollId);

    const votePoll = useVotePoll(id, pollId);
    const unvotePoll = useUnvotePoll(id, pollId);

    const { formatDuration } = useI18nTime();


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



    return (
        <View style={styles.container}>

            <View className="flex-row gap-2 items-center my-2">
                <Avatar src={poll?.createdBy?.avatar}
                    alt={poll?.createdBy?.name?.charAt(0)}
                    size2="md"
                />
                <View>
                    <Text className="font-bold text-lg">
                        {poll?.createdBy?.name}
                    </Text>
                    <Text>{formatDuration(poll?.createdAt)}</Text>
                </View>
            </View>

            <View className="m-2 rounded-xl p-2 border border-gray-200">
                <View className="mb-5">
                    <Text className="text-xl font-bold">
                        {poll?.question}
                    </Text>
                    <Text className="text-gray-600 text-lg">
                        {poll?.hasSelected.length} votes
                    </Text>
                </View>

                <View className="gap-2">
                    {poll?.options?.map((option) => {
                        const includeMe = option?.selectedBy?.map(u => u._id).includes(me?._id);
                        const percent = Math.round(getPercent(option?.selectedBy?.length, poll?.hasSelected.length) * 100);
                        return (
                            <Button
                                disabled={poll?.isClosed || votePoll?.isPending}
                                key={option?._id}
                                onPress={() => handleClick(option, includeMe)}
                                onLongPress={() => setSelectedOption(option)}
                                className="rounded-full py-4 bg-orange-50 border border-orange-200">
                                <View
                                    className="absolute left-0 top-0 bottom-0 rounded-full"
                                    style={{
                                        width: `${percent}%`,
                                        backgroundColor: getColorForPercent(percent)
                                    }}
                                />
                                <View className="flex-row justify-between items-center px-2 ">
                                    <View className="flex-row items-center gap-2">
                                        <View className={`rounded-full w-10 h-10 border-2 items-center justify-center border-white ${includeMe ? "bg-orange-600" : "bg-orange-100"}`} >
                                        {includeMe && <IconSymbol name="checkmark" size={24}/>}
                                            </View>
                                        <Text className="text-lg">{option.value}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-1">
                                        {!poll?.isAnonymous &&

                                            <AvatarsGroup avatars={option?.selectedBy?.map(u => ({
                                                avatar: u.avatar,
                                                alt: u?.name.charAt(0)
                                            }))}
                                                size2="sm"
                                                maxLength={3}
                                            />
                                        }
                                        <Text className="font-bold text-lg">
                                            {percent} %
                                        </Text>

                                    </View>

                                </View>
                            </Button>
                        );

                    })}
                </View>


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


            <PickUsersModal open={!!selectedOption}
                onClose={() => setSelectedOption(null)}
                users={selectedOption?.selectedBy}
                disabled
                title="Votants"
            />
        </View>
    )


}