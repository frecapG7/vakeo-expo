import { Button } from "@/components/ui/Button";
import { eachDayOfInterval, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Animated, { FadeIn, SlideInUp, SlideOutDown } from "react-native-reanimated";


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


export default function DatesEdit() {


    const now = new Date();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectingStartDate, setSelectingStartDate] = useState(true);


    useEffect(() => {
        setSelectingStartDate(!Boolean(startDate))
    }, [selectingStartDate, startDate])



    return (
        <Animated.ScrollView style={{
            flex: 1,
            marginHorizontal: 20,
        }}>


            <View className="flex flex-row gap-1justify-around items-center mt-4 mb-2">
                <Pressable className={`flex flex-grow ${selectingStartDate && "bg-gray-200"} p-2`} onPress={() => {
                    setEndDate('')
                    setStartDate('')
                }}>
                    <Text className="text-md font-bold">Date de début</Text>
                    {startDate && (
                        <Animated.View entering={FadeIn} exiting={SlideOutDown}>
                            <Text className="text-sm text-gray-500">{startDate}</Text>
                        </Animated.View>
                    )}
                </Pressable>
                <Pressable className={`flex flex-grow ${!selectingStartDate && "bg-gray-200"} p-2`} onPress={() => {
                    setEndDate('')
                    setStartDate('')
                }}>
                    <Text className="text-md font-bold">Date de fin</Text>
                    {endDate && (
                        <Animated.View entering={SlideInUp} exiting={SlideOutDown}>
                            <Text className="text-sm text-gray-500" onPress={() => {
                                setEndDate('')
                            }}>{endDate}</Text>
                        </Animated.View>
                    )}
                </Pressable>

            </View>
            <Calendar
                style={{
                    // backgroundColor: "inherit",
                    // borderWidth: 1,
                    // height: 350
                }}
                onDayPress={day => {
                    if (selectingStartDate)
                        setStartDate(day.dateString)
                    else
                        setEndDate(day.dateString)
                }}
                markingType="period"
                markedDates={{
                    [startDate]: {
                        startingDay: true, color: 'blue', textColor: 'white', selected: true, disableTouchEvent: true
                    },
                    [endDate]: {
                        endingDay: true, color: 'blue', textColor: 'white', selected: true, disableTouchEvent: true
                    },
                    ...eachDayOfInterval({
                        start: parseISO(startDate),
                        end: parseISO(endDate)
                    }).reduce((acc: Record<string, any>, date) => {
                        acc[date.toISOString().split('T')[0]] = {
                            color: 'blue',
                            textColor: 'white',
                            selected: true,
                            disableTouchEvent: true
                        }
                        return acc;
                    }, {} as Record<string, any>)
                }}
                minDate={startDate ? startDate : now.toISOString().split('T')[0]} />


            <Button title="Organiser un vote" className="mt-5 bg-blue-300" onPress={() => console.log("toto")} />


        </Animated.ScrollView>
    );
}