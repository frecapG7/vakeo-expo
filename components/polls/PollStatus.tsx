import { Button } from "@/components/ui/Button";
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
        <Button onPress={onNewClick}>
            <Text className="text-blue-600 font-medium">+ Créer un sondage</Text>
        </Button>
    );

    if (hasVoted) return (
        <Button className="flex-row items-center gap-2" onPress={() => onPollClick(poll._id)}>
            <Text className="text-xl">✅</Text>
            <Text className="text-green-600 font-medium">Vous avez voté</Text>
        </Button>
    );

    return (
        <Button className="flex-row items-center gap-1" onPress={() => onPollClick(poll._id)}>
            <Text className="text-xl">⏳</Text>
            <Text className="text-orange-600 font-medium">Voter maintenant</Text>
        </Button>
    );
};