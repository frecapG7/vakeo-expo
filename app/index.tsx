import { AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { GlassSheetBackground, GlassSurface } from "@/components/ui/GlassSurface";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Screen } from "@/components/ui/Screen";
import { TripsEmptyState } from "@/components/trips/TripsEmptyState";
import { default as styles } from "@/constants/Styles";
import { useBatchTrips, type BatchTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useGetStorageTrips } from "@/hooks/storage/useStorageTrips";
import useColors from "@/hooks/styles/useColors";

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BlurTargetView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Text, View, type ViewProps } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

/** Carte de trip de la home. Composant à part : chaque carte porte la ref
 *  <BlurTargetView> de sa propre image (cible du blur Android de la chip date). */
const TripCard = ({ trip, onPress }: { trip: BatchTrip, onPress: () => void }) => {

    const { formatRange } = useI18nTime();
    const imageRef = useRef<View>(null);

    return (
        <Button
            className="rounded-2xl h-52 overflow-hidden"
            onPress={onPress}>

            <BlurTargetView ref={imageRef} style={{ height: "100%", width: "100%" }}>
                <ImageBackground source={trip.image}
                    style={{
                        height: "100%",
                        width: '100%',
                    }}
                    contentFit="cover"
                >

                    <LinearGradient
                        colors={['#10173600', '#101736E6']}
                        style={{ flex: 1, justifyContent: 'flex-end' }}>

                        <View className="px-5 pb-4 gap-2">
                            <View className="flex-row items-center gap-2">
                                <View className="flex-1 min-w-0">
                                    {!!trip.startDate &&
                                        <GlassSurface
                                            glassEffectStyle="clear"
                                            tintColor="#F7B74A"
                                            blurTarget={imageRef}
                                            style={{ borderRadius: 999, alignSelf: "flex-start", maxWidth: "100%" }}>
                                            <View className="flex-row items-center gap-1 px-2.5 py-1 min-w-0">
                                                <IconSymbol name="calendar" size={12} color="#16265C" />
                                                <Text className="text-ink text-xs font-bold capitalize min-w-0" numberOfLines={2}>
                                                    {formatRange(trip.startDate, trip.endDate, { hideYear: false })}
                                                </Text>
                                            </View>
                                        </GlassSurface>
                                    }
                                </View>
                                <AvatarsGroup
                                    avatars={(trip?.users ?? []).map((user: any) => ({
                                        avatar: user?.avatar,
                                        alt: user?.name?.charAt(0),
                                    }))}
                                    size2="xs"
                                    maxLength={3} />
                            </View>
                            <Text className="text-white text-h1" numberOfLines={2}>{trip.name}</Text>
                        </View>

                    </LinearGradient>

                </ImageBackground>
            </BlurTargetView>
        </Button>
    );
};

export default function HomePage() {

  const router = useRouter();


  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();

  // Cible du blur Android du sheet : la liste derrière lui.
  const sheetBlurTarget = useRef<View>(null);
  // Identité stable pour backgroundComponent (sinon remontage du fond à chaque render).
  const SheetBackground = useCallback(
    (props: ViewProps) => <GlassSheetBackground {...props} blurTarget={sheetBlurTarget} />,
    []
  );

  const { data: storageTrips } = useGetStorageTrips();
  // Hydrate batch v3 : chaque entrée porte sa credential (seat token du stockage local).
  const entries = useMemo(() => storageTrips?.map(trip => ({ id: trip._id, token: trip.token })) || [], [storageTrips]);


  const { data: trips, isLoading, isError, refetch } = useBatchTrips(entries);

  const colors = useColors();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <Button
          className="flex flex-row items-center gap-2"
          onPress={() => bottomSheetRef.current?.expand()}>
          <Text className="text-label">Ajouter</Text>
          <IconSymbol name="plus.circle" color={colors.text} size={15} />
        </Button>
    })
  }, [navigation, colors]);


  return (
    <Screen style={{ flex: 1 }}>
      <BlurTargetView ref={sheetBlurTarget} style={{ flex: 1 }}>
        <Animated.FlatList
          data={trips}
          keyExtractor={(item) => item.encodedId}
          renderItem={({ item }) =>
            <TripCard
              trip={item}
              onPress={() => router.push(`./${item.encodedId}`)} />
          }
          ItemSeparatorComponent={() => <View className="h-4" />}
          // keyboardDismissMode="on-drag"
          itemLayoutAnimation={LinearTransition}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 24 }}
          ListEmptyComponent={
            <TripsEmptyState
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              onCreate={() => router.push("./new")}
              onJoin={() => router.push("./join")} />
          }
        />
      </BlurTargetView>
      <BottomSheet ref={bottomSheetRef}
        index={-1}
        backgroundComponent={SheetBackground}
        backgroundStyle={styles.bottomSheet}>
        <BottomSheetView style={{ flex: 1 }}>
          <View className="flex flex-col gap-3 m-4 pb-8">
            <Button className="self-end" onPress={() => bottomSheetRef.current?.close()}>
              <IconSymbol name="xmark.circle" color={colors.text} />
            </Button>
            <Button className="bg-amber p-4 rounded-2xl flex-row items-center gap-4" onPress={() => {
              router.push("./new");
              bottomSheetRef.current?.close();
            }}>
              <IconSymbol name="plus.circle" size={44} color="#16265C" />
              <View className="flex-1">
                <Text className="text-h1 text-night">
                  Créer un nouveau voyage
                </Text>
                <Text className="text-sm text-night/70">
                  Commence un nouveau projet de voyage de zéro
                </Text>
              </View>
            </Button>
            <Button className="border-2 border-night dark:border-white/25 bg-mist dark:bg-transparent p-4 rounded-2xl flex-row items-center gap-4" onPress={() => {
              router.push("./join");
              bottomSheetRef.current?.close()
            }}>
              <IconSymbol name="link" size={44} color="#EE8B33" />
              <View className="flex-1">
                <Text className="text-h1 text-night dark:text-white">
                  Rejoins un voyage existant
                </Text>
                <Text className="text-sm text-night/70 dark:text-white/60">
                  Utilise un lien d&apos;invitation pour rejoindre tes amis
                </Text>
              </View>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Screen>
  )

}
