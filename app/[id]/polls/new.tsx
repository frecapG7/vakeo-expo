import { FormText } from "@/components/form/FormText";
import { DatesPollOptionsForm } from "@/components/polls/DatesPollOptionsForm";
import { HousingOptionsForm } from "@/components/polls/HousingOptionsForm";
import { OtherPollOptionsForm } from "@/components/polls/OtherPollOptionsForm";
import { PollSettingsForm } from "@/components/polls/PollSettingsForm";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Avatar } from "@/components/ui/Avatar";
import styles from "@/constants/Styles";
import { useTrip } from "@/context/TripContext";
import { usePostPoll } from "@/hooks/api/usePolls";
import { Poll } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useContext, useEffect, useMemo, useState } from "react";
import dayjs from "@/lib/dayjs-config";
import { useEffect } from "react";

import { useController, useForm } from "react-hook-form";
import { Text, View, TouchableOpacity, Pressable, TextInput, Alert } from "react-native";
import Animated from "react-native-reanimated";
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

// Configuration française pour le calendrier natif
LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['DIM.','LUN.','MAR.','MER.','JEU.','VEN.','SAM.'],
  today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';

const placeholder = (type: string, format: string | null): string => {
    if (type === "DatesPoll" && format === "calendar") return "Quand êtes-vous disponibles ?";
    if (type === "DatesPoll") return "On part quand ?";
    if (type === "HousingPoll") return "On loge où ?";
    return "On fait quoi ?";
}

// ==========================================
// COMPOSANT : CALENDRIER DE CRÉATION NATIF
// ==========================================
const CreationCalendarNative = ({ options, onChange, me }: { options: any[], onChange: (opts: any[]) => void, me: any }) => {
    const [pendingStart, setPendingStart] = useState<any>(null);

    const optionsByDate = useMemo(() => {
        const map = new Map();
        options.forEach(opt => map.set(dayjs(opt.startDate).format('YYYY-MM-DD'), true));
        return map;
    }, [options]);

    const handleToggleDay = (dayJsObj: any) => {
        const targetDateStr = dayJsObj.format('YYYY-MM-DD');
        const exists = optionsByDate.has(targetDateStr);

        if (exists) {
            const newOptions = options.filter(opt => dayjs(opt.startDate).format('YYYY-MM-DD') !== targetDateStr);
            onChange(newOptions);
            if (pendingStart && dayJsObj.isSame(pendingStart, 'day')) setPendingStart(null);
        } else {
            if (!pendingStart) {
                setPendingStart(dayJsObj);
                onChange([...options, {
                    startDate: dayJsObj.startOf('day').toISOString(),
                    endDate: dayJsObj.endOf('day').toISOString()
                }]);
            } else {
                const start = pendingStart.isBefore(dayJsObj) ? pendingStart : dayJsObj;
                const end = pendingStart.isBefore(dayJsObj) ? dayJsObj : pendingStart;

                let currentDay = start.startOf('day');
                const lastDay = end.startOf('day');
                const newOptions = [...options];

                while (currentDay.isBefore(lastDay) || currentDay.isSame(lastDay, 'day')) {
                    const dateStr = currentDay.format('YYYY-MM-DD');
                    if (!optionsByDate.has(dateStr)) {
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

    const renderDay = (date: DateData & { state: string }) => {
        const dayJsDate = dayjs(date.dateString);
        const isSelected = optionsByDate.has(date.dateString);
        const isCurrentMonth = date.state !== 'disabled';

        return (
            <Pressable
                onPress={() => handleToggleDay(dayJsDate)}
                className={`w-full aspect-[0.65] border border-gray-200 dark:border-gray-800 p-[2px] 
                    ${isSelected ? "bg-green-500 dark:bg-green-600 border-orange-500 border-[1.5px] z-10" : "bg-gray-50 dark:bg-gray-900"} 
                    ${!isCurrentMonth ? "opacity-40" : ""}
                `}
            >
                <View className="flex-row justify-between items-start">
                    <Text className={`text-xs font-semibold ${isCurrentMonth ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>
                        {date.day}
                    </Text>
                </View>

                <View className="flex-1 justify-end overflow-hidden mt-[2px] gap-[1px]">
                    {isSelected && (
                        <View style={{ backgroundColor: "#f97316" }} className="px-[2px] py-[1px] rounded-sm">
                            <Text className="text-white font-bold text-[7px]" numberOfLines={1} ellipsizeMode="clip">
                                Moi
                            </Text>
                        </View>
                    )}
                </View>
            </Pressable>
        );
    };

    return (
        <View className="flex-1 pb-4">
            {pendingStart && (
                <Text className="text-center text-xs text-orange-500 font-bold mb-2">
                    Sélectionnez la date de fin...
                </Text>
            )}
            <Calendar
                current={dayjs().format('YYYY-MM-DD')}
                firstDay={1}
                hideExtraDays={false}
                renderArrow={(direction: 'left' | 'right') => (
                    <IconSymbol name={direction === 'left' ? 'chevron.left' : 'chevron.right'} size={24} color="gray" />
                )}
                theme={{
                    calendarBackground: 'transparent',
                    textSectionTitleColor: '#9ca3af',
                    textSectionTitleDisabledColor: '#d1d5db',
                    monthTextColor: '#111827',
                    textMonthFontWeight: 'bold',
                    textMonthFontSize: 20,
                    'stylesheet.calendar.header': {
                        header: { flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, marginTop: 6, alignItems: 'center', marginBottom: 10 },
                        dayHeader: { marginTop: 2, marginBottom: 7, width: 32, textAlign: 'center', fontSize: 12, color: '#9ca3af', fontWeight: 'bold' }
                    }
                }}
                dayComponent={({ date, state }: any) => renderDay({ ...date, state })}
            />
        </View>
    );
};

// ==========================================
// PAGE PRINCIPALE : CRÉATION
// ==========================================
export default function NewPoll() {
    const { control, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            question: "",
            type: "",
            isSingleAnswer: false,
            isAnonymous: false,
            options: [] 
        }
    });

    const { field: { value: optionsValue, onChange: setOptionsValue } } = useController({
        control, name: "options", defaultValue: []
    });
    
    const currentQuestion = watch("question");

    const { type: typeParam, stop } = useLocalSearchParams<{ type: string, stop?: string }>();
    const { trip, me } = useTrip();
    const postPoll = usePostPoll(trip?._id, me?._id);
    const router = useRouter();

    const [creationType, setCreationType] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<'calendar' | 'list' | null>(null);
    const [pollFormat, setPollFormat] = useState<'calendar' | 'list' | null>(null);

    useEffect(() => {
        if (typeParam) {
            setCreationType(String(typeParam));
            if (typeParam !== "DatesPoll") {
                setPollFormat('list');
            }
        }
    }, [typeParam]);

    const onSubmit = async (data: Omit<Poll, '_id'>) => {
        try {
            const finalQuestion = pollFormat === "calendar" ? data.question + "\u200B" : data.question;

            // FORÇAGE DES DATES : On s'assure d'envoyer optionsValue
            // ASTUCE AUTO-VOTE : On pré-remplit "selectedBy" avec ton ID pour que tu sois déjà compté comme votant !
            const finalOptions = pollFormat === "calendar" 
                ? optionsValue.map((opt: any) => ({ ...opt, selectedBy: me?._id ? [me._id] : [] }))
                : data.options;

            const payload = {
                ...data,
                question: finalQuestion,
                type: creationType,
                options: finalOptions, // Les options forcées
                ...(stop && { stop })
            };

            const result = await postPoll.mutateAsync(payload);

            router.replace({
                pathname: "/[id]/polls/[pollId]",
                params: { id: trip?._id, pollId: result._id }
            });
        } catch (error: any) {
            console.error("Erreur API :", error);
            
            // MOCK DE SECOURS (Seulement si l'API crashe)
            const mockData = {
                question: pollFormat === "calendar" ? currentQuestion + "\u200B" : currentQuestion,
                options: optionsValue
            };

            Alert.alert("Mode Simulation", "API injoignable : Passage en mode simulation (Mock).");
            
            setTimeout(() => {
                router.replace({
                    pathname: "/[id]/polls/[pollId]",
                    params: { 
                        id: trip?._id, 
                        pollId: "mock_poll_123",
                        mockType: pollFormat,
                        mockData: JSON.stringify(mockData) 
                    } 
                });
            }, 300);
        }
    }

    if (creationType === "DatesPoll" && !pollFormat) {
        return (
            <View style={styles.container} className="p-4 pt-10 flex-1 bg-gray-50 dark:bg-gray-900">
                <Text className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">Format des dates</Text>
                
                <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => setSelectedFormat("calendar")}
                    className={`p-6 rounded-2xl border-2 shadow-sm mb-4 items-center transition-colors ${selectedFormat === 'calendar' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'}`}
                >
                    <IconSymbol name="calendar" size={48} color={selectedFormat === 'calendar' ? '#f97316' : '#6b7280'} />
                    <Text className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">Disponibilités (Calendrier)</Text>
                    <Text className="text-center text-gray-500">Sélectionnez vos dates directement sur le calendrier. Les participants feront de même.</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => setSelectedFormat("list")}
                    className={`p-6 rounded-2xl border-2 shadow-sm items-center transition-colors ${selectedFormat === 'list' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'}`}
                >
                    <IconSymbol name="list.bullet" size={48} color={selectedFormat === 'list' ? '#f97316' : '#6b7280'} />
                    <Text className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">Sondage Classique (Liste)</Text>
                    <Text className="text-center text-gray-500">Vous proposez des blocs de dates définis et les participants votent pour leurs favoris.</Text>
                </TouchableOpacity>

                <View className="mt-auto pb-4">
                    <Button title="Continuer" variant="contained" disabled={!selectedFormat} onPress={() => setPollFormat(selectedFormat)} />
                </View>
            </View>
        );
    }

    if (pollFormat === "calendar") {
        return (
            <View style={styles.container} className="flex-1">
                <Animated.ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                    <View className="m-2 mb-4 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 pb-0 overflow-hidden">
                        <View className="p-4 pb-0">
                            <View className="flex-row items-center gap-2 mb-4">
                                <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="sm" />
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">{me?.name || "Moi"}</Text>
                                </View>
                            </View>
                            <TextInput
                                value={currentQuestion}
                                onChangeText={(text) => setValue("question", text)}
                                placeholder="Posez votre question ici..."
                                placeholderTextColor="#9ca3af"
                                className="text-2xl font-bold dark:text-white mb-4 p-0"
                                multiline
                            />
                        </View>
                        <CreationCalendarNative options={optionsValue} onChange={setOptionsValue} me={me} />
                    </View>
                </Animated.ScrollView>

                <View className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-950/90 border-t border-gray-100 dark:border-gray-900">
                    <Button 
                        variant="contained" 
                        icon="tray" 
                        title="Lancer le sondage" 
                        onPress={handleSubmit(onSubmit)} 
                        isLoading={postPoll?.isPending}
                        disabled={!currentQuestion || optionsValue.length === 0} 
                    />
                </View>
            </View>
        );
    }

    return (
        <Animated.ScrollView className="flex-1 mt-4 mx-4" contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Question *</Text>
                <FormText control={control} name="question" rules={{ required: true, maxLength: 255 }} placeholder={placeholder(creationType || "", pollFormat)} />
            </View>

            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Options</Text>
                {creationType === "DatesPoll" && pollFormat === "list" && <DatesPollOptionsForm control={control} />}
                {creationType === "OtherPoll" && <OtherPollOptionsForm control={control} />}
                {creationType === "HousingPoll" && <View className="flex-1 my-2"><HousingOptionsForm control={control} /></View>}
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