import { Button } from "@/components/ui/Button";
import { DatePollOption, HousingPollOption, OtherPollOption, Poll, PollOption } from "@/types/models";
import { useState } from "react";
import { Modal, Text, TextInput, View } from "react-native";

interface AddOptionModalProps {
    open: boolean;
    onClose: () => void;
    poll: Poll;
    onAdd: (newOption: PollOption) => void;
    isLoading: boolean;
}

export function AddOptionModal({ open, onClose, poll, onAdd, isLoading }: AddOptionModalProps) {
    const [newOption, setNewOption] = useState<Partial<PollOption>>({});

    const handleSubmit = () => {
        if (!newOption || Object.keys(newOption).length === 0) return;

        const baseOption: Omit<PollOption, '_id'> = {
            selectedBy: [],
            percent: 0,
        };

        let typedOption: PollOption;

        if (poll.type === "DatesPoll") {
            typedOption = {
                ...baseOption,
                startDate: new Date(newOption.startDate as string),
                endDate: new Date(newOption.endDate as string),
            } as DatePollOption;
        }
        else if (poll.type === "HousingPoll") {
            typedOption = {
                ...baseOption,
                image: newOption.image as string || "",
                icon: newOption.icon as string || "",
                url: newOption.url as string || "",
                title: newOption.title as string || "",
            } as HousingPollOption;
        }
        else {
            typedOption = {
                ...baseOption,
                value: newOption.value as string || "",
            } as OtherPollOption;
        }

        onAdd(typedOption);
        setNewOption({});
        onClose();
    };

    const isValid = (): boolean => {
        if (!newOption || Object.keys(newOption).length === 0) return false;

        if (poll.type === "DatesPoll") {
            const option = newOption as Partial<DatePollOption>;
            return !!(option.startDate && option.endDate);
        }
        else if (poll.type === "HousingPoll") {
            const option = newOption as Partial<HousingPollOption>;
            return !!option.title;
        }
        else {
            const option = newOption as Partial<OtherPollOption>;
            return !!option.value;
        }
    };

    return (
        <Modal
            visible={open}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 p-4">
                <View className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 gap-4">
                    {/* Header */}
                    <View className="flex-row justify-between items-center">
                        <Text className="text-xl font-bold dark:text-white">
                            Ajouter une option
                        </Text>
                        <Button
                            variant="outlined"
                            size="small"
                            icon="xmark"
                            onPress={onClose}
                        />
                    </View>

                    {/* Type-specific form */}
                    {poll.type === "DatesPoll" && (
                        <View className="gap-4">
                            <View>
                                <Text className="text-sm font-medium mb-1 dark:text-gray-300">
                                    Date de début
                                </Text>
                                <TextInput
                                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-black dark:text-white"
                                    placeholder="JJ/MM/AAAA"
                                    value={newOption.startDate as string || ""}
                                    onChangeText={(t) => setNewOption({ ...newOption, startDate: t })}
                                />
                            </View>
                            <View>
                                <Text className="text-sm font-medium mb-1 dark:text-gray-300">
                                    Date de fin
                                </Text>
                                <TextInput
                                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-black dark:text-white"
                                    placeholder="JJ/MM/AAAA"
                                    value={newOption.endDate as string || ""}
                                    onChangeText={(t) => setNewOption({ ...newOption, endDate: t })}
                                />
                            </View>
                        </View>
                    )}

                    {poll.type === "HousingPoll" && (
                        <View className="gap-4">
                            <View>
                                <Text className="text-sm font-medium mb-1 dark:text-gray-300">
                                    Titre
                                </Text>
                                <TextInput
                                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-black dark:text-white"
                                    placeholder="Titre du logement"
                                    value={newOption.title as string || ""}
                                    onChangeText={(t) => setNewOption({ ...newOption, title: t })}
                                />
                            </View>
                            <View>
                                <Text className="text-sm font-medium mb-1 dark:text-gray-300">
                                    URL de l'image
                                </Text>
                                <TextInput
                                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-black dark:text-white"
                                    placeholder="https://..."
                                    value={newOption.image as string || ""}
                                    onChangeText={(t) => setNewOption({ ...newOption, image: t })}
                                />
                            </View>
                            <View>
                                <Text className="text-sm font-medium mb-1 dark:text-gray-300">
                                    URL du logement
                                </Text>
                                <TextInput
                                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-black dark:text-white"
                                    placeholder="https://..."
                                    value={newOption.url as string || ""}
                                    onChangeText={(t) => setNewOption({ ...newOption, url: t })}
                                />
                            </View>
                            <View>
                                <Text className="text-sm font-medium mb-1 dark:text-gray-300">
                                    Icône (emoji)
                                </Text>
                                <TextInput
                                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-black dark:text-white"
                                    placeholder="🏠"
                                    value={newOption.icon as string || ""}
                                    onChangeText={(t) => setNewOption({ ...newOption, icon: t })}
                                />
                            </View>
                        </View>
                    )}

                    {poll.type === "OtherPoll" && (
                        <View>
                            <Text className="text-sm font-medium mb-1 dark:text-gray-300">
                                Option
                            </Text>
                            <TextInput
                                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-black dark:text-white"
                                placeholder="Nouvelle option"
                                value={newOption.value as string || ""}
                                onChangeText={(t) => setNewOption({ ...newOption, value: t })}
                            />
                        </View>
                    )}

                    {/* Submit button */}
                    <Button
                        title="Ajouter"
                        onPress={handleSubmit}
                        disabled={!isValid()}
                        variant="contained"
                        isLoading={isLoading}
                    />
                </View>
            </View>
        </Modal>
    );
}
