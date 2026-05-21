import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
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
  const colors = useColors(); // <-- Branchement direct sur le fichier de ton pote
  
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
      <View style={[styles.container, styles.loadingCenter, { backgroundColor: colors.calendarBackground }]}>
        <ActivityIndicator size="large" color={colors.calendarPrimary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.calendarBackground }]}>
      
      {/* NAVIGATION DU MOIS */}
      <View style={styles.monthNavigator}>
        <TouchableOpacity onPress={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}>
            <IconSymbol name="chevron.left" size={24} color={colors.calendarPrimary} />
        </TouchableOpacity>
        <Text style={[styles.monthText, { color: colors.text }]}>{currentMonth.format('MMMM YYYY')}</Text>
        <TouchableOpacity onPress={() => setCurrentMonth(currentMonth.add(1, 'month'))}>
            <IconSymbol name="chevron.right" size={24} color={colors.calendarPrimary} />
        </TouchableOpacity>
      </View>

      {/* GRILLE DU CALENDRIER */}
      <View style={styles.calendarContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }}>
            
            <View style={[styles.timeColumn, { borderRightColor: colors.border }]}>
              {hours.map(h => (
                <View key={h} style={styles.hourCell}>
                  <Text style={[styles.hourLabel, { color: colors.inputPlaceHolder }]}>{h}:00</Text>
                </View>
              ))}
            </View>

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
                    
                    <View style={[styles.dayHeader, { borderBottomColor: colors.border }]}>
                      <Text style={[styles.dayName, { color: colors.inputPlaceHolder }]}>{day.name}</Text>
                      <View style={[styles.dayCircle, day.isToday && { backgroundColor: colors.calendarPrimary }]}>
                        <Text style={[styles.dayNum, { color: colors.text }, day.isToday && { color: colors.background }]}>
                          {day.number}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.gridColumn, { borderRightColor: colors.border }]}>
                      {hours.map(h => (
                        <View key={`grid-${day.id}-${h}`} style={[styles.gridCell, { borderBottomColor: colors.neutral }]} />
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
                           <TouchableOpacity 
                             key={event.id || event._id} 
                             style={[
                               styles.eventBlock, 
                               { 
                                 top: topPosition, 
                                 height: eventHeight,
                                 backgroundColor: colors.card,
                                 borderLeftColor: colors.calendarPrimary
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
                              <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
                                {event.name || event.title}
                              </Text>
                              <Text style={[styles.eventTimeLabel, { color: colors.text }]} numberOfLines={1}>
                                {startObj.format('HH:mm')}
                              </Text>
                           </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingCenter: { justifyContent: 'center', alignItems: 'center' },
  monthNavigator: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30, paddingVertical: 15 },
  monthText: { fontSize: 18, fontWeight: '700', textTransform: 'capitalize' },
  calendarContainer: { flex: 1 },
  timeColumn: { width: TIME_COL_WIDTH, borderRightWidth: 1 },
  hourCell: { height: HOUR_HEIGHT, alignItems: 'center' },
  hourLabel: { fontSize: 12, marginTop: -8 },
  dayHeader: { height: 70, alignItems: 'center', borderBottomWidth: 1 },
  dayName: { fontSize: 13, marginBottom: 5 },
  dayCircle: { width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  dayNum: { fontSize: 18, fontWeight: '500' },
  gridColumn: { borderRightWidth: 1, position: 'relative' },
  gridCell: { height: HOUR_HEIGHT, borderBottomWidth: 1 },
  eventBlock: { position: 'absolute', left: 4, right: 4, borderRadius: 8, padding: 6, borderLeftWidth: 4, zIndex: 5, justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  eventTitle: { fontSize: 11, fontWeight: 'bold' },
  eventTimeLabel: { fontSize: 9, fontWeight: '600' },
});