import { FormText } from "@/components/form/FormText";
import { DatesPollOptionsForm } from "@/components/polls/DatesPollOptionsForm";
import { HousingOptionsForm } from "@/components/polls/HousingOptionsForm";
import { OtherPollOptionsForm } from "@/components/polls/OtherPollOptionsForm";
import { PollSettingsForm } from "@/components/polls/PollSettingsForm";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { usePostPoll } from "@/hooks/api/usePolls";
import { Poll } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useContext, useEffect, useMemo, useState } from "react";
import dayjs from "@/lib/dayjs-config";

import { useController, useForm } from "react-hook-form";
import { Text, View, Pressable, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";

const placeholder = (type: string): string => {
    if (type === "DatesPoll") return "On part quand?";
    else if (type === "HousingPoll") return "On loge ou?";
    else return "On part ou?";
}

const CreationCalendar = ({ options, onChange }: { options: any[], onChange: (opts: any[]) => void }) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [pendingStart, setPendingStart] = useState<any>(null);

    const calendarDays = useMemo(() => {
        const startOfMonth = currentMonth.startOf('month');
        const startOfGrid = startOfMonth.startOf('isoWeek');
        const endOfGrid = startOfGrid.add(41, 'day');
        const days = [];
        let day = startOfGrid;
        while (day.isBefore(endOfGrid) || day.isSame(endOfGrid, 'day')) {
            days.push(day);
            day = day.add(1, 'day');
        }
        return days;
    }, [currentMonth]);

    const handleToggleDay = (day: any) => {
        const targetDateStr = day.format('YYYY-MM-DD');
        const existingIndex = options.findIndex((opt: any) => dayjs(opt.startDate).format('YYYY-MM-DD') === targetDateStr);
        
        if (existingIndex !== -1) {
            const newOptions = [...options];
            newOptions.splice(existingIndex, 1);
            onChange(newOptions);
            if (pendingStart && day.isSame(pendingStart, 'day')) setPendingStart(null);
        } else {
            if (!pendingStart) {
                setPendingStart(day);
                onChange([...options, {
                    startDate: day.startOf('day').toISOString(),
                    endDate: day.endOf('day').toISOString()
                }]);
            } else {
                const start = pendingStart.isBefore(day) ? pendingStart : day;
                const end = pendingStart.isBefore(day) ? day : pendingStart;

                let currentDay = start.startOf('day');
                const lastDay = end.startOf('day');
                const newOptions = [...options];

                while (currentDay.isBefore(lastDay) || currentDay.isSame(lastDay, 'day')) {
                    const exists = newOptions.some(opt => dayjs(opt.startDate).isSame(currentDay, 'day'));
                    if (!exists) {
                        newOptions.push({
                            startDate: currentDay.startOf('day').toISOString(),
                            endDate: currentDay.endOf('day').toISOString()
                        });
                    }
                    currentDay = currentDay.add(1, 'day');
                }
                
                newOptions.sort((a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf());
                onChange(newOptions);
                setPendingStart(null); 
            }
        }
    };

    return (
        <View className="mt-2">
            <View className="flex-row items-center justify-between mb-4 bg-gray-50 dark:bg-gray-900 p-2 rounded-xl">
                <TouchableOpacity onPress={() => setCurrentMonth(prev => prev.subtract(1, 'month'))} className="p-2">
                    <IconSymbol name="chevron.left" size={20} color="gray" />
                </TouchableOpacity>
                <Text className="text-md font-bold dark:text-white capitalize">{currentMonth.format("MMMM YYYY")}</Text>
                <TouchableOpacity onPress={() => setCurrentMonth(prev => prev.add(1, 'month'))} className="p-2">
                    <IconSymbol name="chevron.right" size={20} color="gray" />
                </TouchableOpacity>
            </View>

            <View className="flex-row border-b border-gray-200 dark:border-gray-800 pb-2 mb-2">
                {["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"].map((d, i) => (
                    <Text key={i} className="flex-1 text-center text-gray-400 font-bold text-[10px]">{d}</Text>
                ))}
            </View>

            <View className="flex-row flex-wrap">
                {calendarDays.map((day, i) => {
                    const isCurrentMonth = day.isSame(currentMonth, 'month');
                    const isSelected = options.some((opt: any) => day.isSame(dayjs(opt.startDate), 'day'));

                    return (
                        <TouchableOpacity key={i} onPress={() => handleToggleDay(day)} className="w-[14.28%] aspect-square justify-center items-center p-1">
                            <View className={`w-full h-full justify-center items-center rounded-lg ${isSelected ? 'bg-orange-500 shadow-sm' : ''} ${!isCurrentMonth && !isSelected ? 'opacity-30' : ''}`}>
                                <Text className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{day.format("D")}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            
            {pendingStart && <Text className="text-center text-xs text-orange-400 mt-2">Sélectionnez la date de fin...</Text>}
            {options.length > 0 && <Text className="text-center text-xs text-orange-500 font-bold mt-2">{options.length} jour(s) sélectionné(s)</Text>}
        </View>
    );
};

export default function NewPoll() {
    // CORRECTION : Plus de defaultView dans le useForm !
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            question: "",
            type: "",
            isSingleAnswer: false,
            isAnonymous: false,
            options: [] 
        }
    });

    const { field: { value: type, onChange: setType } } = useController({
        control, name: "type", rules: { required: true }
    });

    const { field: { value: optionsValue, onChange: setOptionsValue } } = useController({
        control, name: "options", defaultValue: []
    });

    // CORRECTION : C'est une valeur 100% visuelle, gérée par un state local
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

    const { type: typeParam, stop } = useLocalSearchParams<{ type: string, stop?: string }>();
    const { trip, me } = useContext(TripContext);
    const postPoll = usePostPoll(trip?._id, me?._id);
    const router = useRouter();

    const onSubmit = async (data: Omit<Poll, '_id'>) => {
        try {
            const result = await postPoll.mutateAsync({
                ...data,
                ...(stop && { stop })
            });
            router.replace({
                pathname: "/[id]/polls/[pollId]",
                params: { id: trip?._id, pollId: result._id }
            });
        } catch (error: any) {
            console.error("Erreur serveur :", error);
        }
    }

    useEffect(() => {
        if (typeParam) setValue("type", String(typeParam));
    }, [typeParam, setValue]);

    if (!type)
        return (
            <View style={styles.container}>
                <Text className="text-lg font-bold text-center mt-4">Quel type de sondage veux-tu organiser ? </Text>
                <View className="flex-row flex-wrap justify-center gap-5 m-5">
                    <Button className="flex bg-orange-200 rounded-xl w-[40%] gap-2 border-blue-50 shadow p-2"
                        onPress={() => { setViewMode("calendar"); setType("DatesPoll"); }}>
                        <IconSymbol name="calendar" color="black" size={34} />
                        <Text className="capitalize text-md font-bold text-center"> Dates (Calendrier)</Text>
                    </Button>
                    <Button className="flex bg-orange-200 rounded-xl w-[40%] gap-2 border-blue-50 shadow p-2"
                        onPress={() => { setViewMode("list"); setType("DatesPoll"); }}>
                        <IconSymbol name="list.bullet" color="black" size={34} />
                        <Text className="capitalize text-md font-bold text-center"> Dates (Liste)</Text>
                    </Button>
                    <Button className="flex bg-orange-200 rounded-xl w-[40%] gap-2 border-blue-50 shadow p-2"
                        onPress={() => setType("HousingPoll")}>
                        <IconSymbol name="house.fill" color="black" size={34} />
                        <Text className="capitalize text-md font-bold text-center"> Hébergements</Text>
                    </Button>
                    <Button className="flex bg-orange-200 rounded-xl w-[40%] gap-2 border-blue-50 shadow p-2"
                        onPress={() => setType("OtherPoll")}>
                        <IconSymbol name="chart.bar.fill" color="black" size={34} />
                        <Text className="capitalize text-md font-bold text-center"> Autre chose</Text>
                    </Button>
                </View>
            </View>
        )

    return (
        <Animated.ScrollView className="flex-1 mt-4 mx-4" contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
            
            {type === "DatesPoll" && (
                <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Affichage par défaut du sondage</Text>
                    <View className="flex-row bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                        <Pressable onPress={() => setViewMode('calendar')} className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}>
                            <IconSymbol name="calendar" size={18} color={viewMode === 'calendar' ? '#f97316' : 'gray'} />
                            <Text className={`ml-2 font-semibold ${viewMode === 'calendar' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Calendrier</Text>
                        </Pressable>
                        <Pressable onPress={() => setViewMode('list')} className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}>
                            <IconSymbol name="list.bullet" size={18} color={viewMode === 'list' ? '#f97316' : 'gray'} />
                            <Text className={`ml-2 font-semibold ${viewMode === 'list' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Liste</Text>
                        </Pressable>
                    </View>
                </View>
            )}

            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Question *</Text>
                <FormText control={control} name="question" rules={{ required: true, maxLength: 255 }} placeholder={placeholder(type)} />
            </View>

            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Options</Text>
                {type === "DatesPoll" && viewMode === "list" && <DatesPollOptionsForm control={control} />}
                {type === "DatesPoll" && viewMode === "calendar" && <CreationCalendar options={optionsValue} onChange={setOptionsValue} />}
                {type === "OtherPoll" && <OtherPollOptionsForm control={control} />}
                {type === "HousingPoll" && <View className="flex-1 my-2"><HousingOptionsForm control={control} /></View>}
            </View>

            <View className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Paramètres</Text>
                <PollSettingsForm control={control} />
            </View>

            <View className="my-4">
                <Button variant="contained" icon="tray" title="Démarrer le sondage" onPress={handleSubmit(onSubmit)} isLoading={postPoll?.isPending} />
            </View>
        </Animated.ScrollView>
    )
}