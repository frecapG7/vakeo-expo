import { Button } from "@/components/ui/Button"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { LinearProgress } from "@/components/ui/LinearProgress"
import useI18nTime from "@/hooks/i18n/useI18nTime"
import { getPercent } from "@/lib/voteUtils"
import { Text, View } from "react-native"
import AnimatedCheckbox from "react-native-checkbox-reanimated"


interface IUser {
    _id: string,
    name: string,
    avatar: string
}

interface IVote {
    _id: string,
    startDate: Date,
    endDate: Date
    users: [IUser]
}

interface IDatesVote {
    createdBy: IUser,
    voters: [IUser],
    votes: [IVote],
    status: string
}

export const DatesVoteDetails = ({vote, me}: {vote?: IDatesVote, me?: IUser}) => {

    const {formatRange} = useI18nTime();

    return (
        <View>
            <View className="gap-5 mt-10">
                {vote?.votes?.map((v) => {
                    const percent = getPercent(v.users.length, vote.voters.length);
                    return (
                        <View className="gap-1 bg-orange-200 dark:bg-gray-200 p-2 rounded-lg" key={v._id}>
                            <View className="flex-row items-end justify-between px-2">
                                {/* <Text className="text-xl dark:text-white">{formatDate(v.startDate)} - {formatDate(v.endDate)}</Text> */}
                                <View className="flex-row items-end">
                                    <Button onPress={() => {
                                        console.log("todo")
                                    }}
                                        className="w-6 h-6">
                                        <AnimatedCheckbox
                                            checked={vote.voters.map(u => u._id).includes(me._id)}
                                            highlightColor="#4444ff"
                                            checkmarkColor="#483AA0"
                                            boxOutlineColor="#4444ff"
                                        />

                                    </Button>
                                    <Text className="text-sm capitalize">{formatRange(v.startDate, v.endDate)}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <IconSymbol name="person" color="dark" />
                                    <Text>{v.users.length}</Text>
                                </View>

                            </View>
                            <LinearProgress progress={percent} />
                        </View>

                    )
                }
                )}
            </View>

        </View>
    )



}