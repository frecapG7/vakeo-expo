import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Poll, TripUser } from "@/types/models";
import { Text } from "react-native";

interface PollStatusProps {
    poll?: Poll;
    selectedUser?: TripUser;
    onNewClick: () => void;
    onPollClick: (pollId: string) => void;
}

export const PollStatus = ({ poll, selectedUser, onNewClick, onPollClick }: PollStatusProps) => {
    const hasVoted = poll?.hasSelected?.some(v => v._id === selectedUser?._id);

    if (!poll) return (
        <Button className="flex-row items-center gap-1 bg-blue-100 dark:bg-blue-900/40 p-2 rounded-xl"
            onPress={onNewClick}>
            <IconSymbol name="plus" size={16} color="#2563EB" />
            <Text className="text-blue-700 dark:text-blue-400 font-medium text-sm">
                Créer un sondage
            </Text>
        </Button>
    );

    if (poll.isClosed) return (
        <Button className="flex-row items-center gap-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-xl"
            onPress={() => onPollClick(poll._id)}>
            <IconSymbol name="lock.fill" size={16} color="#6B7280" />
            <Text className="text-gray-500 dark:text-gray-400 font-medium text-sm">Sondage terminé</Text>
        </Button>
    );

    if (hasVoted) return (
        <Button className="flex-row items-center gap-2 bg-green-100 dark:bg-green-900/40 p-2 rounded-xl"
            onPress={() => onPollClick(poll._id)}>
            <IconSymbol name="checkmark.circle.fill" size={16} color="#16A34A" />
            <Text className="text-green-700 dark:text-green-400 font-medium text-sm">Vous avez voté</Text>
        </Button>
    );

    return (
        <Button className="flex-row items-center gap-1 bg-orange-100 dark:bg-orange-900/40 p-2 rounded-xl"
            onPress={() => onPollClick(poll._id)}>
            <IconSymbol name="exclamationmark" size={16} color="#EA580C" />
            <Text className="text-orange-700 dark:text-orange-400 font-medium text-sm">Voter maintenant</Text>
        </Button>
    );
};