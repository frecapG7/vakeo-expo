import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetStorageTrips } from "@/hooks/storage/useStorageTrips";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Image } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";



const trips = [
  {
    id: "454435643645",
    name: "Road trip à Aix-en-Provence",
    description: "",
    users: ["Martin", "Willy"],
    img: "https://picsum.photos/seed/696/3000/2000",
    color: "bg-red-500",
  },
  {
    id: "654646584685",
    name: "Séjour à la montagne",
    description: "Randonnée et ski",
    users: ["Flow", "Tom"],
    img: "https://picsum.photos/seed/500/3000/1000",
    color: "bg-blue-500"
  },
  {
    id: "6546465841314",
    name: "Italie en amoureux",
    users: ["Flow", "Tom"],
    img: "https://picsum.photos/seed/100/3000/1000",
    color: "bg-blue-500"
  },
  {
    id: "35141635465464",
    name: "St-Magot",
    description: "St malo entre cheumi",
    img: "https://picsum.photos/seed/400/3000/1000",
    users: ["Flow", "Tom"],
    color: "bg-blue-500"
  }
]


export default function HomePage() {


  const { control } = useForm();
  const router = useRouter();

  const search = useWatch({
    control,
    name: "search"
  });



  const bottomSheetRef = useRef<BottomSheet>(null);


  const navigation = useNavigation();



  const {data: storageTrips} = useGetStorageTrips();


  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <Button title="Ajouter"
          onPress={() => bottomSheetRef.current?.expand()}
          className="flex flex-row justify-center items-center p-2 rounded-lg" />
    })
  }, [navigation]);


  return (
    <GestureHandlerRootView>
      <View className="m-5">
        <Text className="dark:text-white ml-5">Rechercher</Text>
        <FormText label="Rechercher" control={control} name="search" endAdornment={<IconSymbol name="magnifyingglass" />} />
      </View>
      <View className="mx-2">
        <Animated.FlatList
          data={storageTrips?.filter(item => !search || item.name.toLowerCase().includes(search))}
          keyExtractor={(item) => item._id}
          renderItem={({ item, separators }) =>
            <View>
              <Pressable style={{ flex: 1 }}
                className="flex flex-row justify-between items-center bg-orange-100 dark:bg-gray-100 px-2 py-5 rounded-lg"
                onPress={() => router.push(`./${item._id}`)}
                onLongPress={() => separators.highlight}>
                <View className="flex flex-row gap-1 items-center">
                  <Image
                    style={styles.image}
                    source={item.image}
                    // placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={1000}
                  />
                  <View className="flex flex-col">
                    <Text className="text-lg font-bold">{item.name}</Text>
                    <View className="rounded flex-row bg-blue-200 items-center justify-center flex-grow">
                      <Text>4 </Text>
                      <IconSymbol name="person.circle" color="black"/>
                      </View>
                    {/* <Text className="font-italic">{JSON.stringify(item)}</Text> */}
                  </View>
                </View>
                <View>
                  <IconSymbol name="chevron.right" size={24} color="black" />
                </View>
              </Pressable>

            </View>
          }
          ItemSeparatorComponent={() => <View className="h-5" />}
          keyboardDismissMode="on-drag"
          itemLayoutAnimation={LinearTransition}
        />
      </View>


      <BottomSheet ref={bottomSheetRef} index={-1}
        handleStyle={{
          backgroundColor: "primary"
        }}
        backgroundStyle={{
          backgroundColor: "primary"
        }}>
        <BottomSheetView >
          <View className="flex flex-col gap-2 m-2 pb-5">
            <Pressable onPress={() => bottomSheetRef.current?.close()}>
              <IconSymbol name="xmark.circle" color="primary" />
            </Pressable>
            <Pressable className="bg-purple-200 dark:bg-gray-200 p-2 rounded-lg flex-row items-center gap-2" onPress={() => {
              router.push("./new");
              bottomSheetRef.current?.close();
            }}>
              <IconSymbol name="plus.circle" size={50} color="primary" />
              <View>
                <Text className="text-2xl font-bold dark:text-gray-600">
                  Créer un nouveau voyage
                </Text>
                <Text>
                  Commence un nouveau projet de voyage de zéro
                </Text>
              </View>
            </Pressable>
            <Pressable className="bg-blue-200 p-2 rounded-lg flex-row items-center gap-2" onPress={() => {
              router.push("./join");
              bottomSheetRef.current?.close()
            }}>
              <IconSymbol name="link" size={50} color="blue" />
              <View>
                <Text className="text-2xl font-bold">
                  Rejoins un voyage existant
                </Text>
                <Text>
                  Utilise un lien d'invitation pour rejoindre
                </Text>
              </View>
            </Pressable>

          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  )


}




const styles = StyleSheet.create({
  image: {
    flex: 1,
    maxWidth: 75,
    height: 60,
    // width: 150,
    backgroundColor: '#0553'
  }
})