import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';

// --- Imports de l'architecture Vakéo ---
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetEvents } from "@/hooks/api/useEvents"; 
import { useGetTrip } from "@/hooks/api/useTrips"; 
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";

const { width } = Dimensions.get('window');
const TIME_COL_WIDTH = 55;
const DAY_WIDTH = (width - TIME_COL_WIDTH) / 3;
const HOUR_HEIGHT = 80;

const getDaysInMonth = (baseDate: dayjs.Dayjs) => {
  const days = [];
  const daysInMonth = baseDate.daysInMonth();
  const dayNames = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
  
  for (let i = 1; i <= daysInMonth; i++) {
    const d = baseDate.date(i);
    days.push({
      id: d.format('YYYY-MM-DD'),
      name: dayNames[d.day()],
      number: d.date(),
      fullDate: d,
      isToday: d.isSame(dayjs(), 'day')
    });
  }
  return days;
};

export default function CalendarView() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useColors(); 
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { data: trip, isLoading: isTripLoading } = useGetTrip(String(id));
  const { data, isLoading: isEventsLoading } = useGetEvents(String(id), {}, { enabled: !!id });
  
  const events = useMemo(() => data?.pages?.flatMap((page: any) => page?.events) || [], [data?.pages]);

  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs | null>(null);

  useMemo(() => {
    if (trip?.startDate && !currentMonth) {
      setCurrentMonth(dayjs(trip.startDate));
    } else if (!trip && !currentMonth && !isTripLoading) {
      setCurrentMonth(dayjs());
    }
  }, [trip, isTripLoading]);

  const monthDays = useMemo(() => {
    return currentMonth ? getDaysInMonth(currentMonth) : [];
  }, [currentMonth]);

  const targetDayIndex = useMemo(() => {
    if (!monthDays || monthDays.length === 0) return 0;
    let targetDate = trip?.startDate ? dayjs(trip.startDate) : dayjs();
    const index = monthDays.findIndex(d => d.fullDate.isSame(targetDate, 'day'));
    return index !== -1 ? index : 0;
  }, [monthDays, trip]);

  const scrollToTargetDay = useCallback(() => {
    if (scrollViewRef.current && targetDayIndex > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ 
          x: targetDayIndex * DAY_WIDTH, 
          animated: true 
        });
      }, 150);
    }
  }, [targetDayIndex]);

  useEffect(() => {
    scrollToTargetDay();
  }, [scrollToTargetDay]);

  useFocusEffect(
    useCallback(() => {
      const targetDate = trip?.startDate ? dayjs(trip.startDate) : dayjs();
      setCurrentMonth(targetDate);
    }, [trip])
  );

  const hours = Array.from({ length: 15 }, (_, i) => i + 8); 

  if (isTripLoading || !currentMonth) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.calendarBackground }}>
        <ActivityIndicator size="large" color={colors.calendarPrimary} />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.calendarBackground }}>
      
      {/* NAVIGATION DU MOIS */}
      <View className="flex-row justify-between items-center px-8 py-4">
        <Pressable 
          onPress={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
            <IconSymbol name="chevron.left" size={24} color={colors.calendarPrimary} />
        </Pressable>
        <Text className="text-lg font-bold capitalize" style={{ color: colors.text }}>{currentMonth.format('MMMM YYYY')}</Text>
        <Pressable 
          onPress={() => setCurrentMonth(currentMonth.add(1, 'month'))}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
            <IconSymbol name="chevron.right" size={24} color={colors.calendarPrimary} />
        </Pressable>
      </View>

      {/* GRILLE DU CALENDRIER */}
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row">
            
            {/* Colonne des heures fixe */}
            <View className="border-r" style={{ width: TIME_COL_WIDTH, borderRightColor: colors.border }}>
              {hours.map(h => (
                <View key={h} className="items-center" style={{ height: HOUR_HEIGHT }}>
                  <Text className="text-xs -mt-2" style={{ color: colors.inputPlaceHolder }}>{h}:00</Text>
                </View>
              ))}
            </View>

            {/* Grille défilante des jours */}
            <ScrollView 
              ref={scrollViewRef}
              horizontal 
              showsHorizontalScrollIndicator={false} 
              snapToInterval={DAY_WIDTH} 
              decelerationRate="fast"
            >
              {monthDays.map((day) => {
                const dayEvents = events.filter((e: any) => dayjs(e.startDate).isSame(day.fullDate, 'day'));

                return (
                  <View key={day.id} style={{ width: DAY_WIDTH }}>
                    
                    {/* En-tête de colonne jour */}
                    <View className="h-[70px] items-center border-b" style={{ borderBottomColor: colors.border }}>
                      <Text className="text-xs mb-1" style={{ color: colors.inputPlaceHolder }}>{day.name}</Text>
                      <View className="w-[35px] h-[35px] justify-center items-center rounded-full" style={[day.isToday && { backgroundColor: colors.calendarPrimary }]}>
                        <Text className="text-lg font-medium" style={[{ color: colors.text }, day.isToday && { color: colors.background }]}>
                          {day.number}
                        </Text>
                      </View>
                    </View>

                    {/* Conteneur des cellules du jour */}
                    <View className="border-r relative" style={{ borderRightColor: colors.border }}>
                      {hours.map(h => (
                        <View key={`grid-${day.id}-${h}`} className="border-b" style={{ height: HOUR_HEIGHT, borderBottomColor: colors.neutral }} />
                      ))}
                      
                      {dayEvents.map((event: any) => {
                         const startObj = dayjs(event.startDate);
                         const endObj = dayjs(event.endDate);
                         const startHour = startObj.hour() + (startObj.minute() / 60);
                         const duration = endObj.diff(startObj, 'hour', true);
                         
                         if (startHour < 8 && startHour + duration <= 8) return null; 
                         
                         const topPosition = (Math.max(startHour, 8) - 8) * HOUR_HEIGHT;
                         const eventHeight = duration * HOUR_HEIGHT;

                         return (
                           <Pressable 
                             key={event.id || event._id} 
                             className="absolute left-1 right-1 rounded-g p-1.5 border-l-4 justify-between shadow-sm"
                             style={({ pressed }) => [
                               { 
                                 top: topPosition, 
                                 height: eventHeight,
                                 backgroundColor: colors.card,
                                 borderLeftColor: colors.calendarPrimary,
                                 opacity: pressed ? 0.7 : 1
                               }
                             ]}
                             onPress={() => {
                               const eventId = event._id || event.id;
                               router.navigate({
                                 pathname: "/[id]/events/[eventId]",
                                 params: { id: String(id), eventId: String(eventId) }
                               });
                             }}
                           >
                              <Text className="text-[11px] font-bold" style={{ color: colors.text }} numberOfLines={2}>
                                {event.name || event.title}
                              </Text>
                              <Text className="text-[9px] font-semibold" style={{ color: colors.text }} numberOfLines={1}>
                                {startObj.format('HH:mm')}
                              </Text>
                           </Pressable>
                         );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}