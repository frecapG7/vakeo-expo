import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { useGetTrip, useUpdateTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import { getDatesBetween } from "@/lib/utils";
import dayjs from "dayjs";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import Animated, { FadeIn, SlideInUp, SlideOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

LocaleConfig.locales['fr'] = {
    monthNames: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre'
    ],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';


export default function EditTripDatePage() {


    const [selectingStartDate, setSelectingStartDate] = useState(true);

    const { control, reset, handleSubmit } = useForm();
    const { field: { value: startDate, onChange: setStartDate } } = useController({
        control,
        name: "startDate"
    });
    const { field: { value: endDate, onChange: setEndDate } } = useController({
        control,
        name: "endDate",
    });


    const { formatDate } = useI18nTime();
    useEffect(() => {
        setSelectingStartDate(!Boolean(startDate))
    }, [selectingStartDate, startDate])

    const colors = useColors();


    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));
    const updateTrip = useUpdateTrip(String(id));

    useEffect(() => {
        if (trip)
            reset(trip)
    }, [reset, trip])

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <Button title="Appliquer" isLoading={updateTrip.isPending} onPress={handleSubmit(onSubmit)} />
        })
    }, [navigation]);


    const onSubmit = async (data) => {
        await updateTrip.mutateAsync(data);
        router.replace("..");
    }

    return (
        <SafeAreaView style={styles.container}>

            <View className="flex flex-row gap-1 justify-around items-center mt-4 mb-2 bg-white">
                <Pressable className={`flex flex-grow ${selectingStartDate && "bg-gray-200"} p-2`} onPress={() => {
                    setStartDate('');
                    setEndDate('');
                }}>
                    <Text className="text-md font-bold">Date de début</Text>
                    {startDate && (
                        <Animated.View entering={FadeIn} exiting={SlideOutDown}>
                            <Text className="text-sm text-gray-500">{formatDate(startDate)}</Text>
                        </Animated.View>
                    )}
                </Pressable>
                <Pressable className={`flex flex-grow ${!selectingStartDate && "bg-gray-200"} p-2`} onPress={() => {
                    setStartDate('')
                    setEndDate('')
                }}>
                    <Text className="text-md font-bold">Date de fin</Text>
                    {endDate && (
                        <Animated.View entering={SlideInUp} exiting={SlideOutDown}>
                            <Text className="text-sm text-gray-500" onPress={() => {
                                setEndDate('')
                            }}>
                                {formatDate(endDate)}
                            </Text>
                        </Animated.View>
                    )}
                </Pressable>

            </View>
            <CalendarList
                theme={{
                    backgroundColor: colors.background,
                    calendarBackground: colors.background,
                    textSectionTitleColor: colors.text,
                    dayTextColor: colors.text,
                    textSectionTitleDisabledColor: '#d9e1e8',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    todayBackgroundColor: '#a2daf1ff',
                    textDisabledColor: '#4a85b9ff',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'orange',
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: colors.text,
                    indicatorColor: colors.text,
                }}
                onDayPress={({ dateString }) => {
                    if (selectingStartDate)
                        setStartDate(dayjs(dateString));
                    else
                        setEndDate(dayjs(dateString));
                }}
                markingType="period"
                markedDates={{
                    [dayjs(startDate)?.format("YYYY-MM-DD")]: {
                        startingDay: true,
                        color: colors.primary,
                        textColor: colors.text,
                        selected: true,
                        disableTouchEvent: true
                    },
                    [dayjs(endDate)?.format("YYYY-MM-DD")]: {
                        endingDay: true,
                        color: colors.primary,
                        textColor: colors.text,
                        selected: true,
                        disableTouchEvent: true
                    },
                    ...getDatesBetween(startDate, endDate)
                        .map(date => date?.format('YYYY-MM-DD'))
                        .reduce((acc: Record<string, any>, date) => {
                            acc[date] = {
                                color: colors.neutral,
                                textColor: colors.text,
                                selected: true,
                                disableTouchEvent: true
                            }
                            return acc;
                        }, {} as Record<string, any>)
                }}
                // minDate={start ? start : now.toISOString()}
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={1}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={6}
                // Enable or disable scrolling of calendar list
                scrollEnabled={true}
                // Enable or disable vertical scroll indicator. Default = false
                showScrollIndicator={true}
            />

        </SafeAreaView>
    );
}