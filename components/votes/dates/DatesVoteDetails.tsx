import { PickUsersModal } from "@/components/modals/PickUsersModal"
import { AvatarsGroup } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { LinearProgress } from "@/components/ui/LinearProgress"
import useI18nTime from "@/hooks/i18n/useI18nTime"
import { getPercent } from "@/lib/voteUtils"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"
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

export const DatesVoteDetails = ({ vote, me, onVote, onUnVote }: { vote?: IDatesVote, me?: IUser, onVote: (id: string) => void, onUnVote: (id: string) => void }) => {

    const { formatRange } = useI18nTime();

    const [selectedVote, setSelectedVote] = useState(null);

    return (
        <View>
            <View className="gap-5">
                {vote?.votes
                    ?.sort((a, b) => b?.users.length - a?.users.length)
                    ?.map((v) => {
                        const checked = v.users.map(u => u._id).includes(me._id);
                        const percent = getPercent(v.users.length, vote.voters.length);
                        return (
                            <View className="gap-1 bg-orange-200 dark:bg-gray-200 p-2 rounded-lg" key={v._id}>
                                <View className="flex-row gap-1">
                                    <Button onPress={() => checked ? onUnVote(v._id) : onVote(v._id)}
                                        className="w-6 h-8"
                                        disabled={vote?.status === "CLOSED"}>
                                        <AnimatedCheckbox
                                            checked={checked}
                                            highlightColor="#4444ff"
                                            checkmarkColor="#483AA0"
                                            boxOutlineColor="#4444ff"
                                        />
                                    </Button>

                                    <View className="flex-grow">
                                        <View className="flex-row items-end justify-between px-2">
                                            {/* <Text className="text-xl dark:text-white">{formatDate(v.startDate)} - {formatDate(v.endDate)}</Text> */}
                                            <View className="flex-row items-end">

                                                <Text className="text-sm capitalize">{formatRange(v.startDate, v.endDate)}</Text>
                                            </View>
                                            
                                            <Pressable className="flex-row items-center gap-2" onPress={() => setSelectedVote(v)}>
                                                <AvatarsGroup avatars={v?.users.map(u => ({
                                                    avatar: u.avatar,
                                                    alt: u?.name?.charAt(0)
                                                }))}
                                                    size2="xs"
                                                    maxLength={3}
                                                />
                                            </Pressable>
                                        </View>
                                        <LinearProgress progress={percent} />
                                    </View>

                                </View>

                            </View>

                        )
                    }
                    )}
            </View>

             <PickUsersModal open={Boolean(selectedVote)}
                            onClose={() => setSelectedVote(null)}
                            users={selectedVote?.users}
                            disabled
                        />

        </View>
    )



}