import useI18nTime from "@/hooks/i18n/useI18nTime"
import { getPercent, getVoteLabel } from "@/lib/voteUtils"
import { Text, View } from "react-native"
import { Avatar } from "../ui/Avatar"
import { Button } from "../ui/Button"
import { Checkbox } from "../ui/Checkbox"
import { IconSymbol } from "../ui/IconSymbol"
import { LinearProgress } from "../ui/LinearProgress"

interface IUser {
    _id: string,
    name: string,
    avatar: string
}


interface IVote {
    createdBy: IUser,
    voters: [IUser],
    status: string,
    type: string
}

export const VoteListItem = ({ vote, trip, user, onClick }: { vote: IVote, trip: any, user?: any, onClick?: () => void }) => {

    const { formatDuration } = useI18nTime();

    return (
        <View>
            <View className="flex-row pl-2 items-end justify-between">
                <Text className="text-md dark:text-white">
                    {getVoteLabel(vote)}
                </Text>


                <Text className="italic text-xs dark:text-white">
                    {vote?.status === "OPEN" ? `Ouvert depuis ${formatDuration(vote?.createdAt, new Date())}`
                        : "Clôturé"}
                </Text>
            </View>
            <Button className="flex-row rounded-lg bg-orange-200 dark:bg-gray-200 p-2 gap-1" onPress={onClick}>

                <View className="w-10 h-10">
                    <Checkbox checked={vote?.voters.map(v => v._id).includes(user?._id)} />
                </View>
                <View className="flex-1 gap-1">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center ">
                            {vote?.voters.map((v, index) =>
                                <View key={v._id}
                                    className={`flex ${index > 0 && "-ml-3"}`}>
                                    <Avatar src={v.avatar}
                                        size2="sm"
                                        alt={v.name?.charAt(0)}
                                    />
                                </View>
                            )}
                        </View>
                        <View className="flex-row gap-1 items-center ">
                            <IconSymbol name="person" size={20} color="black" />
                            <Text className="font-bold">{vote?.voters.length}</Text>
                        </View>
                    </View>
                    <LinearProgress progress={getPercent(vote?.voters.length, trip?.users.length)} />
                </View>

            </Button>
        </View>
    )
}