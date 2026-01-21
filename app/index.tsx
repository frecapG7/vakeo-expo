import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Search } from "@/components/ui/Search";
import { default as styles } from "@/constants/Styles";
import { useGetStorageTrips } from "@/hooks/storage/useStorageTrips";
import useColors from "@/hooks/styles/useColors";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ImageBackground } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function HomePage() {

  const { control, setValue } = useForm();
  const router = useRouter();

  // const search = useWatch({
  //   control,
  //   name: "search"
  // });


  const [search, setSearch] = useState<string>("");

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
    <GestureHandlerRootView style={styles.container}>

      {/* <View> */}
        <Animated.FlatList
          ListHeaderComponent={() =>
            <View className="mx-5 mb-5">
              <Search value={search}  onChange={setSearch} />
              {/* <Text className="dark:text-white ml-5">Rechercher</Text>
              <FormText label="Rechercher"
                control={control}
                name="search"
                endAdornment={<View className="flex flex-row gap-1 items-center">
                  {!!search &&
                    <Animated.View entering={ZoomIn}>
                      <Pressable onPress={() => setValue("search", "")}>
                        <IconSymbol name="xmark.circle" />
                      </Pressable>
                    </Animated.View>
                  }
                  <IconSymbol name="magnifyingglass" />
                </View>} /> */}
            </View>
            }
          data={storageTrips?.filter(item => !search || item.name.toLowerCase().includes(search))}
          keyExtractor={(item) => item._id}
          renderItem={({ item, separators }) =>
            <Pressable
              className="rounded-xl h-40"
              onPress={() => router.push(`./${item._id}`)}>

              <ImageBackground source={item.image}
                style={{
                  height: "100%",
                  width: '100%', // Prend toute la largeur disponible
                }}
                contentFit="cover"
                // imageStyle={{ borderRadius: 8 }} // Arrondi les coins de l'image
              >

                <View className="flex-1 rounded-lg flex-row justify-between bg-[rgba(0,0,0,0.3)] px-5 ">
                  <View className="justify-end">
                    <Text className="text-white text-2xl font-bold align-end">{item.name}</Text>

                  </View>
                  <View className="flex h-full justify-center">
                    <IconSymbol name="chevron.right" size={34} color="white" />
                  </View>
                </View>

              </ImageBackground>
            </Pressable>
          }
          ItemSeparatorComponent={() => <View className="my-5" />}
          // keyboardDismissMode="on-drag"
          itemLayoutAnimation={LinearTransition}
        />
      {/* </View> */}

      <BottomSheet ref={bottomSheetRef}
        index={-1}
        backgroundStyle={{
          backgroundColor: colors.neutral,
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
  )


}
