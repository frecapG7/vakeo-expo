import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import Styles from "@/constants/Styles";
import { useGetStorageTrips } from "@/hooks/storage/useStorageTrips";
import useColors from "@/hooks/styles/useColors";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Image } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomePage() {

  const { control } = useForm();
  const router = useRouter();

  const search = useWatch({
    control,
    name: "search"
  });

  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();

  const { data: storageTrips } = useGetStorageTrips();


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
      <GestureHandlerRootView style={Styles.container}>
        <View className="mx-5 mb-5">
          <Text className="dark:text-white ml-5">Rechercher</Text>
          <FormText label="Rechercher" control={control} name="search" endAdornment={<IconSymbol name="magnifyingglass" />} />
        </View>
        <View>
          <Animated.FlatList
            data={storageTrips?.filter(item => !search || item.name.toLowerCase().includes(search))}
            keyExtractor={(item) => item._id}
            renderItem={({ item, separators }) =>
              <Button
                className="flex flex-row justify-between items-center bg-orange-100 dark:bg-gray-100 px-2 py-5 rounded-lg"
                onPress={() => router.push(`./${item._id}`)}>
                <View className="flex flex-row gap-1 items-center">
                  <Image
                    style={styles.image}
                    source={item.image}
                    contentFit="cover"
                    transition={1000}
                  />
                  <View className="flex flex-col">
                    <Text className="text-lg font-bold">{item.name}</Text>
                  </View>
                </View>
                <View>
                  <IconSymbol name="chevron.right" size={24} color="black" />
                </View>
              </Button>
            }
            ItemSeparatorComponent={() => <View className="h-5" />}
            keyboardDismissMode="on-drag"
            itemLayoutAnimation={LinearTransition}
          />
        </View>

        <BottomSheet ref={bottomSheetRef}
          index={-1}
          handleStyle={{
            
          }}
          backgroundStyle={{
            backgroundColor: colors.background,
            ...Styles.bottomSheet

          }}>
          <BottomSheetView style={styles.bottomContainer}>
            <View className="flex flex-col gap-2 m-2 pb-5">
              <Button onPress={() => bottomSheetRef.current?.close()}>
                <IconSymbol name="xmark.circle" color={colors.text} />
              </Button>
              <Button className="flex bg-purple-200 dark:bg-gray-200 p-2 rounded-lg flex-row items-center gap-2" onPress={() => {
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




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  bottomContainer: {
    flex: 1,
    // padding: 10,
    // alignItems: 'center',
  },
  image: {
    flex: 1,
    maxWidth: 75,
    height: 60,
    // width: 150,
    backgroundColor: '#0553'
  }
})