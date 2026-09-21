import { IconSymbol } from "@/components/ui/IconSymbol";
import dayjs from "@/lib/dayjs-config";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { Calendar, DateData } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';

// Configuration française pour le calendrier natif
LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['DIM.','LUN.','MAR.','MER.','JEU.','VEN.','SAM.'],
  today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';

const getUserColor = (userId: string) => {
    const colors = ["#3b82f6", "#ef4444", "#eab308", "#a855f7", "#14b8a6", "#ec4899", "#f97316"];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const getBgColor = (voteCount: number) => {
    if (voteCount === 0) return "bg-gray-50 dark:bg-gray-900";
    if (voteCount <= 2) return "bg-green-100 dark:bg-green-900/30";
    if (voteCount <= 4) return "bg-green-300 dark:bg-green-700/50";
    return "bg-green-500 dark:bg-green-600";
};

export default function SharedCalendar({ poll, me, onToggleDay }: any) {
    
    const initialDate = poll?.options?.[0]?.startDate ? dayjs(poll.options[0].startDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');

    // On pré-calcule un "dictionnaire" des options par date pour que le rendu de chaque jour soit hyper rapide
    const optionsByDate = useMemo(() => {
        const map = new Map();
        poll?.options?.forEach((opt: any) => {
            const dateStr = dayjs(opt.startDate).format('YYYY-MM-DD');
            map.set(dateStr, opt);
        });
        return map;
    }, [poll?.options]);

    // Fonction de rendu personnalisé pour chaque case du calendrier
    const renderDay = (date: DateData & { state: string }) => {
        const dayJsDate = dayjs(date.dateString);
        const optionForDay = optionsByDate.get(date.dateString);
        
        const voters = optionForDay?.selectedBy || [];
        const voteCount = voters.length;
        const isSelectedByMe = voters.some((u: any) => u._id === me?._id);

        const visibleVoters = voters.slice(0, 3);
        const extraVoters = voters.length - 3;
        
        const isCurrentMonth = date.state !== 'disabled'; // Géré par react-native-calendars

        return (
            <Pressable
                disabled={poll.isClosed}
                onPress={() => onToggleDay(dayJsDate)}
                className={`w-full aspect-[0.65] border border-gray-200 dark:border-gray-800 p-[2px] 
                    ${getBgColor(voteCount)} 
                    ${!isCurrentMonth ? "opacity-40" : ""}
                    ${isSelectedByMe ? "border-orange-500 border-[1.5px] z-10" : ""}
                `}
            >
                <View className="flex-row justify-between items-start">
                    <Text className={`text-xs font-semibold ${isCurrentMonth ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>
                        {date.day}
                    </Text>
                </View>

                {/* GESTION DE L'ANONYMAT CORRIGÉE */}
                <View className="flex-1 justify-end overflow-hidden mt-[2px] gap-[1px]">
                    {poll.isAnonymous ? (
                        // Si sondage anonyme et qu'il y a des votes, on n'affiche qu'un seul bloc global
                        voteCount > 0 ? (
                            <View className="px-[2px] py-[1px] rounded-sm bg-gray-500/80">
                                <Text className="text-white font-bold text-[7px] text-center" numberOfLines={1}>
                                    {voteCount} vote{voteCount > 1 ? 's' : ''}
                                </Text>
                            </View>
                        ) : null
                    ) : (
                        // Si sondage public, on affiche les prénoms avec leurs couleurs
                        <>
                            {visibleVoters.map((user: any) => (
                                <View key={user._id} style={{ backgroundColor: getUserColor(user._id) }} className="px-[2px] py-[1px] rounded-sm">
                                    <Text className="text-white font-bold text-[7px]" numberOfLines={1} ellipsizeMode="clip">
                                        {user.name}
                                    </Text>
                                </View>
                            ))}
                            {extraVoters > 0 && (
                                <View className="px-[2px] py-[1px] rounded-sm bg-gray-400/50 dark:bg-gray-700/50">
                                    <Text className="text-gray-900 dark:text-white font-bold text-[7px] text-center">
                                        +{extraVoters}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </Pressable>
        );
    };

    return (
        <View className="flex-1 bg-white dark:bg-gray-950 pb-4">
            
            <Calendar
                current={initialDate}
                firstDay={1} // Semaine commence le Lundi
                hideExtraDays={false}
                
                // Personnalisation de l'en-tête (Mois / Flèches)
                renderArrow={(direction: 'left' | 'right') => (
                    <IconSymbol name={direction === 'left' ? 'chevron.left' : 'chevron.right'} size={24} color="gray" />
                )}
                
                theme={{
                    calendarBackground: 'transparent',
                    textSectionTitleColor: '#9ca3af', // Gris pour LUN, MAR, MER...
                    textSectionTitleDisabledColor: '#d1d5db',
                    monthTextColor: '#111827',
                    textMonthFontWeight: 'bold',
                    textMonthFontSize: 20,
                    'stylesheet.calendar.header': {
                        header: {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingLeft: 10,
                            paddingRight: 10,
                            marginTop: 6,
                            alignItems: 'center',
                            marginBottom: 10
                        },
                        dayHeader: {
                            marginTop: 2,
                            marginBottom: 7,
                            width: 32,
                            textAlign: 'center',
                            fontSize: 12,
                            color: '#9ca3af',
                            fontWeight: 'bold'
                        }
                    }
                }}

                // Injecte notre rendu visuel personnalisé dans la mécanique du calendrier natif
                dayComponent={({ date, state }: any) => renderDay({ ...date, state })}
            />

            {/* LÉGENDE */}
            <View className="flex-row items-center justify-center gap-4 py-4 border-t border-gray-100 dark:border-gray-900 mt-2">
                <View className="flex-row items-center gap-1">
                    <View className="w-4 h-4 rounded bg-green-100 border border-green-200" />
                    <Text className="text-gray-500 text-xs font-semibold">1-2</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <View className="w-4 h-4 rounded bg-green-300 border border-green-400" />
                    <Text className="text-gray-500 text-xs font-semibold">3-4</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <View className="w-4 h-4 rounded bg-green-500 border border-green-600" />
                    <Text className="text-gray-500 text-xs font-semibold">5+</Text>
                </View>
            </View>
        </View>
    );
}