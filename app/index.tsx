import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Search } from "@/components/ui/Search";
import { Skeleton } from "@/components/ui/Skeleton";
import { default as styles } from "@/constants/Styles";
import { useSearchTrips } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useGetStorageTrips } from "@/hooks/storage/useStorageTrips";
import useColors from "@/hooks/styles/useColors";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ImageBackground } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {

  const router = useRouter();

  const [search, setSearch] = useState<string>("");

  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();

  const { data: storageTrips } = useGetStorageTrips();
  const ids = useMemo(() => storageTrips?.map(trip => trip._id) || [], [storageTrips]);


  const { data: trips, isLoading } = useSearchTrips(ids, search);

  const { formatRange, formatDate, formatDuration } = useI18nTime();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <Button
          className="flex flex-row items-center gap-2"
          onPress={() => bottomSheetRef.current?.expand()}>
          <Text className="text-md font-bold dark:text-white">Ajouter</Text>
          <IconSymbol name="plus.circle" color={colors.text} size={15} />
        </Button>
    })
  }, [navigation]);

  const colors = useColors();


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.container}>
        <Animated.FlatList
          ListHeaderComponent={
            <View className="mx-5 mb-5">
              <Search value={search} onChange={setSearch} />
            </View>
          }
          data={trips}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) =>
            <Button
              className="rounded-xl h-60 p-1 shadow bg-blue-100 dark:bg-gray-600"
              onPress={() => router.push(`./${item._id}`)}>

              <ImageBackground source={item.image}
                style={{
                  height: "100%",
                  width: '100%', // Prend toute la largeur disponible,
                }}
                imageStyle={{ borderRadius: 6 }}
                contentFit="cover"
              >

                <View className="flex-1 rounded-lg flex-row justify-between bg-[rgba(0,0,0,0.3)] px-5 ">
                  <View className="justify-between py-2">
                    <View className="">
                      <Text className="text-white text-2xl font-bold align-end">{item.name}</Text>
                      {item.startDate &&

                        <View className="flex gap-1">
                          <Text className="text-lg text-white capitalize font-bold">
                            {formatRange(item.startDate, item.endDate, { hideYear: false })}
                          </Text>
                        </View>
                      }
                    </View>
                    <View className="flex-row gap-3 items-center">
                      {item?.users?.slice(0, 5).map((user) =>
                        <View key={user._id} className="items-center">
                          <Avatar src={user?.avatar} alt={user?.name?.charAt(0)} size2="sm" />
                          <Text className="font-bold text-white max-w-120" numberOfLines={1}>{user?.name}</Text>
                        </View>
                      )}
                      {item?.users?.length > 5 &&
                        <View className="items-center">
                          <Avatar alt="..." size2="md" />
                          <Text className="font-bold text-white">+{item?.users.length - 5}</Text>
                        </View>}
                    </View>
                  </View>
                  <View className="flex h-full justify-center">
                    <IconSymbol name="chevron.right" size={34} color="white" />
                  </View>
                </View>

              </ImageBackground>
            </Button>
          }
          ItemSeparatorComponent={() => <View className="my-5" />}
          // keyboardDismissMode="on-drag"
          itemLayoutAnimation={LinearTransition}
          ListEmptyComponent={<View>
            {isLoading &&
              <View className="gap-10">
                <Skeleton height={40} />
                <Skeleton height={40} />
              </View>
            }
          </View>}
        />
        <BottomSheet ref={bottomSheetRef}
          index={-1}
          backgroundStyle={{
            backgroundColor: colors.background,
            ...styles.bottomSheet
          }}>
          <BottomSheetView style={{ flex: 1 }}>
            <View className="flex flex-col gap-2 m-2 pb-5">
              <Button onPress={() => bottomSheetRef.current?.close()}>
                <IconSymbol name="xmark.circle" color={colors.text} />
              </Button>
              <Button className="flex bg-orange-300 dark:bg-gray-200 p-2 rounded-lg flex-row items-center gap-2" onPress={() => {
                router.push("./new");
                bottomSheetRef.current?.close();
              }}>
                <IconSymbol name="plus.circle" size={50} color="primary" />
                <View>
                  <Text className="text-2xl font-bold text-wrap">
                    Créer un nouveau voyage
                  </Text>
                  <Text className="text-sm text-pretty">
                    Commence un nouveau projet de voyage de zéro
                  </Text>
                </View>
              </Button>
              <Button className="bg-blue-200 p-2 rounded-lg flex-row items-center gap-2 " onPress={() => {
                router.push("./join");
                bottomSheetRef.current?.close()
              }}>
                <IconSymbol name="link" size={50} color="blue" />
                <View>
                  <Text className="text-2xl font-bold">
                    Rejoins un voyage existant
                  </Text>
                  <Text className="text-sm">
                    Utilise un lien d'invitation pour rejoindre tes amis
                  </Text>
                </View>
              </Button>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  )


}
