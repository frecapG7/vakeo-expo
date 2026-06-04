import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { IconSymbol } from "@/components/ui/IconSymbol";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";

interface Participant {
  _id: string;
  name: string;
  colorHex: string;
}

interface SharedCalendarPollProps {
  baseDate: dayjs.Dayjs;
  participants: Participant[];
  votes: Record<string, string[]>;
  currentUserId: string;
  onToggleDate: (dateString: string) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export default function SharedCalendarPoll({
  baseDate,
  participants,
  votes,
  onToggleDate,
  onPreviousMonth,
  onNextMonth,
}: SharedCalendarPollProps) {
  const colors = useColors();

  // 1. Calcul précis de la grille (jours du mois, jours grisés avant et après)
  const calendarCells = useMemo(() => {
    const cells = [];
    const daysInMonth = baseDate.daysInMonth();
    const firstDay = baseDate.startOf('month').day();
    const firstDayIndex = firstDay === 0 ? 7 : firstDay; 
    
    const prevMonth = baseDate.subtract(1, 'month');
    const daysInPrevMonth = prevMonth.daysInMonth();

    // Jours grisés du mois précédent
    for (let i = 1; i < firstDayIndex; i++) {
      cells.push({ 
        empty: true, 
        id: `prev-${i}`, 
        dayNumber: daysInPrevMonth - firstDayIndex + i + 1 
      });
    }
    // Jours actifs du mois en cours
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = baseDate.date(i);
      cells.push({ 
        empty: false, 
        id: dateObj.format('YYYY-MM-DD'), 
        dayNumber: i 
      });
    }
    // Jours grisés du mois suivant
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ 
        empty: true, 
        id: `next-${i}`, 
        dayNumber: i 
      });
    }
    return cells;
  }, [baseDate]);

  return (
    <View className="flex-1 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-4">
      
      {/* HEADER NAVIGATEUR (Année / Mois) */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-100 z-10">
        <Pressable className="p-2 rounded-full active:bg-gray-100" onPress={onPreviousMonth}>
          <IconSymbol name="chevron.left" size={24} color="#6b7280" />
        </Pressable>
        <View className="items-center">
          <Text className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Année {baseDate.format('YYYY')}
          </Text>
          <Text className="text-xl font-bold text-gray-900 capitalize">
            {baseDate.format('MMMM')}
          </Text>
        </View>
        <Pressable className="p-2 rounded-full active:bg-gray-100" onPress={onNextMonth}>
          <IconSymbol name="chevron.right" size={24} color="#6b7280" />
        </Pressable>
      </View>

      {/* JOURS DE LA SEMAINE */}
      <View className="flex-row py-2 bg-white border-b border-gray-100">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-[10px] font-bold text-gray-400 uppercase">{day}</Text>
          </View>
        ))}
      </View>

      {/* GRILLE DU CALENDRIER (Incassable, Flex Wrap) */}
      <View className="flex-row flex-wrap border-l border-r border-gray-100 bg-gray-50">
        {calendarCells.map((item) => {
          
          // Si c'est un jour grisé
          if (item.empty) {
            return (
              <View 
                key={item.id} 
                style={{ width: '14.28%' }} 
                className="h-28 border-b border-r border-gray-100 bg-gray-50 opacity-50 p-1"
              >
                <Text className="text-xs font-medium text-gray-400 ml-1">{item.dayNumber}</Text>
              </View>
            );
          }

          // Si c'est un jour normal
          const dayVotes = votes[item.id] || [];
          const voteCount = dayVotes.length;
          const isTopChoice = voteCount === participants.length && voteCount > 0;
          
          // Définition de la couleur de fond en fonction du nombre de votes (Reproduction du CSS de Stitch)
          let cellBgClass = "bg-white active:bg-gray-50";
          let textColorClass = "text-gray-700";

          if (isTopChoice) {
            cellBgClass = "bg-blue-500/20 active:bg-blue-500/30 border-t-2 border-l-2 border-blue-600";
            textColorClass = "text-blue-600";
          } else if (voteCount >= 5) {
            cellBgClass = "bg-green-300 active:bg-green-400";
          } else if (voteCount >= 3) {
            cellBgClass = "bg-green-200 active:bg-green-300";
          } else if (voteCount >= 1) {
            cellBgClass = "bg-green-50 active:bg-green-100";
          }

          // Récupération des données complètes des participants qui ont voté pour ce jour
          const cellAttendees = dayVotes
            .map(voterId => participants.find(p => p._id === voterId))
            .filter(Boolean);

          return (
            <Pressable 
              key={item.id}
              style={{ width: '14.28%' }}
              className={`h-28 border-b border-r border-gray-100 flex-col relative overflow-hidden ${cellBgClass}`}
              onPress={() => onToggleDate(item.id)}
            >
              {/* Numéro du jour et icône étoile si "Top" */}
              <View className="flex-row justify-between items-start pt-1 px-1 z-10">
                <Text className={`text-xs font-bold ml-1 ${textColorClass}`}>
                  {item.dayNumber}
                </Text>
                {isTopChoice && <IconSymbol name="star.fill" size={10} color="#2563eb" />}
              </View>

              {/* BARRES DES PARTICIPANTS (Empilées en bas) */}
              <View className="mt-auto flex-col gap-[1px] w-full pb-[1px]">
                {cellAttendees.map((user) => (
                  <View 
                    key={`${item.id}-${user._id}`} 
                    className="h-3.5 w-full flex-row items-center px-0.5 rounded-sm" 
                    style={{ backgroundColor: user.colorHex }}
                  >
                    <Text className="text-[7px] text-white font-bold leading-none w-full" numberOfLines={1}>
                      {user.name}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* LÉGENDE */}
      <View className="bg-white py-4 px-2 border-t border-gray-100">
        <View className="flex-row justify-center gap-4">
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 rounded bg-green-50 border border-green-200" />
            <Text className="text-[10px] font-medium text-gray-500 uppercase">1-2</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 rounded bg-green-200 border border-green-300" />
            <Text className="text-[10px] font-medium text-gray-500 uppercase">3-4</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 rounded bg-green-300 border border-green-400" />
            <Text className="text-[10px] font-medium text-gray-500 uppercase">5+</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 rounded bg-blue-500/20 border border-blue-600" />
            <Text className="text-[10px] font-medium text-gray-500 uppercase">Top</Text>
          </View>
        </View>
      </View>

    </View>
  );
}