import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Poll, TripUser } from "@/types/models";
import { Text, useColorScheme } from "react-native";

interface PollStatusProps {
    poll?: Poll;
    selectedUser?: TripUser;
    onNewClick: () => void;
    onPollClick: (pollId: string) => void;
}

export const PollStatus = ({ poll, selectedUser, onNewClick, onPollClick }: PollStatusProps) => {
    const isDark = useColorScheme() === "dark";
    const hasVoted = poll?.hasSelected?.some(v => v._id === selectedUser?._id);

    if (!poll) return (
        <Button className="flex-row items-center gap-1 bg-amber p-2 rounded-xl"
            onPress={onNewClick}>
            <IconSymbol name="plus" size={16} color="#16265C" />
            <Text className="text-night font-medium text-sm">
                Créer un sondage
            </Text>
        </Button>
    );

    if (poll.isClosed) return (
        <Button className="flex-row items-center gap-2 bg-mist dark:bg-white/10 p-2 rounded-xl"
            onPress={() => onPollClick(poll._id)}>
            <IconSymbol name="lock.fill" size={16} color={isDark ? "#F6F8FD" : "#16265C"} />
            <Text className="text-night/70 dark:text-white/70 font-medium text-sm">Sondage terminé</Text>
        </Button>
    );

    if (hasVoted) return (
        <Button className="flex-row items-center gap-2 bg-amber/15 dark:bg-amber/20 p-2 rounded-xl"
            onPress={() => onPollClick(poll._id)}>
            <IconSymbol name="checkmark.circle.fill" size={16} color="#EE8B33" />
            <Text className="text-amber-deep dark:text-amber font-medium text-sm">Vous avez voté</Text>
        </Button>
    );

    return (
        <Button className="flex-row items-center gap-1 bg-amber p-2 rounded-xl"
            onPress={() => onPollClick(poll._id)}>
            <IconSymbol name="exclamationmark" size={16} color="#16265C" />
            <Text className="text-night font-medium text-sm">Voter maintenant</Text>
        </Button>
    );
};
