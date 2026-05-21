import { EventIcon } from "@/components/events/EventIcon";  
import { Button } from "@/components/ui/Button";  
import { IconSymbol } from "@/components/ui/IconSymbol";  
import { Skeleton } from "@/components/ui/Skeleton";  
import styles from "@/constants/Styles";  
import { TripContext } from "@/context/TripContext";  
import { useGetEvents } from "@/hooks/api/useEvents";  
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";  
import dayjs from "@/lib/dayjs-config";  
import { Event, TripUser } from "@/types/models";  
import { useLocalSearchParams, useRouter } from "expo-router";  
import { useContext, useMemo, useState } from "react";  
import { Pressable, Text, View } from "react-native";  
import Animated from "react-native-reanimated";  
  
const showDay = (previous?: Event, current?: Event) => {  
 if (!current?.startDate) return false;  
 if (!previous?.startDate) return true;  
 return !dayjs(previous.startDate).isSame(dayjs(current.startDate), 'day');  
}  
  
const typeFilters = [  
 { value: "ACTIVITY", icon: "flame", label: "Activité" },  
 { value: "MEAL", icon: "cart", label: "Repas" },  
 { value: "RESTAURANT", icon: "suit.spade", label: "Restaurant" },  
 { value: "SPORT", icon: "sportscourt", label: "Sport" },  
 { value: "PARTY", icon: "moon.stars.fill", label: "Soirée" }  
]  
  
const EventItem = ({ event, user, colors }: { event: Event, user: TripUser, colors: any }) => {  
 const isAttendee = useMemo(() => event.attendees?.map(u => u._id).includes(user?._id), [user, event]);  
 const isOwner = useMemo(() => event.owners?.map(u => u._id).includes(user?._id), [user, event])  
  
 return (  
 <View className="py-3 pr-1 rounded-xl border-l-4" style={{ backgroundColor: colors.card, borderLeftColor: colors.primary }}>  
 <View className="flex-row gap-2 items-center justify-between">  
 <View className="flex-row items-center" >  
 <EventIcon name={event.type} size="md" />  
 <View className="flex gap-1">  
 <View className="flex-row items-start gap-1">  
 <Text className="text-lg max-w-50 font-bold" style={{ color: colors.text }} numberOfLines={2}>  
 {event.name}  
 </Text>  
 {isOwner &&  
 <Animated.View className="items-center rounded-lg p-1" style={{ backgroundColor: colors.neutral }}>  
 <Text className="text-sm upper-case font-bold" style={{ color: colors.primary }}>RESP.</Text>  
 </Animated.View>}  
 </View>  
 <View className="flex-row items-center ">  
 <IconSymbol name="person.2.fill" color={colors.inputPlaceHolder} size={16} />  
 <Text className="text-sm ml-1" style={{ color: colors.inputPlaceHolder }}>  
 {event?.attendees?.length} inscrit{event?.attendees?.length > 0 && "s"}  
 </Text>  
 </View>  
 </View>  
 </View>  
 <View>  
 {isAttendee &&  
 <Animated.View className="flex-row rounded-lg items-center p-1" style={{ backgroundColor: colors.neutral }}>  
 <IconSymbol name="checkmark" color={colors.notification} size={14} />  
 <Text className="text-xs font-bold ml-1" style={{ color: colors.text }}>Inscrit</Text>  
 </Animated.View>  
 }  
 </View>  
 </View>  
 </View>  
 )  
}  
  
export default function TripPlanning() {  
 const { id } = useLocalSearchParams();  
 const [search, setSearch] = useState("");  
 const [typeFilter, setTypeFilter] = useState("");  
 const [onlyAttendee, setOnlyAttendee] = useState(false);  
 const [onlyOwner, setOnlyOwner] = useState(false);  
  
 const router = useRouter();  
 const { me } = useContext(TripContext);  
 const { formatDate, formatDay , formatHour} = useI18nTime();  
 const colors = useColors();
  
 const { data, hasNextPage, fetchNextPage, isLoading } = useGetEvents(String(id), {  
 type: typeFilter,  
 search,  
 ...(onlyAttendee && { attendee: String(me?._id) }),  
 ...(onlyOwner && { owner: String(me?._id) }),  
 }, { enabled: !!id });  

 const events = useMemo(() => data?.pages.flatMap((page) => page?.events), [data?.pages]);  
  
 return (  
 <Animated.View style={[styles.container, { backgroundColor: colors.background }]}>  
 <Animated.FlatList  
 data={events || []}  
 ListHeaderComponent={  
 <View className="gap-2 mb-5">  
 <View className="flex-row justify-between gap-5">  
 <Pressable className="flex-1 shadow flex-row rounded-lg justify-center items-center p-2 border"  
 style={{ backgroundColor: onlyAttendee ? colors.neutral : colors.card, borderColor: colors.border }}
 onPress={() => setOnlyAttendee(!onlyAttendee)}>  
 <IconSymbol name="checkmark" color={onlyAttendee ? colors.primary : colors.inputPlaceHolder} />  
 <Text className="text-sm ml-1 font-bold" style={{ color: colors.text }}>Mes participations</Text>  
 </Pressable>  
 <Pressable className="flex-1 shadow flex-row rounded-lg justify-center items-center p-2 border" 
 style={{ backgroundColor: onlyOwner ? colors.neutral : colors.card, borderColor: colors.border }} 
 onPress={() => setOnlyOwner(!onlyOwner)}>  
 <IconSymbol name="bookmark.fill" color={onlyOwner ? colors.primary : colors.inputPlaceHolder} />  
 <Text className="text-sm ml-1 font-bold" style={{ color: colors.text }}>Mes responsabilités</Text>  
 </Pressable>  
 </View>  
 <Animated.ScrollView  
 horizontal  
 showsHorizontalScrollIndicator={false}  
 className="flex-row my-2"  
 contentContainerClassName="gap-5">  
 {typeFilters.map(item => (  
 <Pressable  
 key={item.value}  
 className="py-2 px-4 items-center rounded-full border"  
 style={{ backgroundColor: typeFilter === item.value ? colors.primary : colors.card, borderColor: colors.border }}
 onPress={() => setTypeFilter(typeFilter === item?.value ? "" : item.value)}  
 >  
 <Text className="font-bold" style={{ color: typeFilter === item.value ? colors.card : colors.text }}>  
 {item.label}  
 </Text>  
 </Pressable>  
 ))}  
 </Animated.ScrollView>  
 </View>  
 }  
 renderItem={({ item, index, }) =>  
 <View className="gap-2">  
 {showDay(events[index - 1], item) &&  
 <View className="border-b p-1" style={{ borderBottomColor: colors.border }}>  
 <Text className="text-xl font-bold uppercase" style={{ color: colors.primary }}>  
 {formatDay(item.startDate)}  
 </Text>  
 </View>  
 }  
 <View className="flex flex-row">  
 <View className="p-1 justify-around">  
 <Text className="font-medium" style={{ color: colors.text }}>{formatHour(item.startDate)}</Text>  
 <Text style={{ color: colors.inputPlaceHolder }}>{formatHour(item.endDate)}</Text>  
 </View>  
 <Button className="flex-1"  
 onPress={() => router.navigate({  
 pathname: "/[id]/events/[eventId]",  
 params: { id: String(id), eventId: item._id }  
 })}>  
 <EventItem event={item} user={me} colors={colors} />  
 </Button>  
 </View>  
 </View>  
 }  
 ItemSeparatorComponent={() => <View className="my-2" />}  
 keyExtractor={(item) => item?._id}  
 contentContainerClassName="p-2 pb-24"  
 ListEmptyComponent={  
 isLoading ?  
 <View className="gap-5">  
 <Skeleton height={40} />  
 <Skeleton height={40} />  
 </View>  
 :  
 <View className="my-5 flex-1 flex-grow justify-center">  
 <Text className="text-2xl text-center font-bold" style={{ color: colors.inputPlaceHolder }}>  
 Aucune activité  
 </Text>  
 </View>  
 }  
 onEndReached={() => {  
 if (hasNextPage) fetchNextPage();  
 }}  
 />  
 <Pressable className="absolute bottom-6 right-6 p-3 rounded-full border items-center justify-center shadow-lg"  
 style={{ backgroundColor: colors.primary, borderColor: colors.border }}
 onPress={() => router.push({  
 pathname: "/[id]/events/new",  
 params: { id: String(id) }  
 })}>  
 <IconSymbol name="plus" color={colors.card} size={28} />  
 </Pressable>  
 </Animated.View>  
 )  
}