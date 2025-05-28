import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import '../global.css';



const mockData = [
  {
    id: "454435643645",
    name: "Road trip à Aix-en-Provence",
    description: "",
    users: ["Martin", "Willy"],
    color: "bg-red-500"
  },
  {
    id: "654646584685",
    name: "Séjour à la montagne",
    description: "Randonnée et ski",
    users: ["Flow", "Tom"],
    color: "bg-blue-500"
  }
]


export default function HomePage() {



  const router = useRouter();

  return (
    <Animated.ScrollView style={{
      marginHorizontal: 10,
    }}>
      <Animated.View>
        {mockData.map((project, index) => (
          <Pressable key={project.id}
            onPress={() => router.push(`/trips/${project.id}`)}
            className={`${index % 2 === 0 ? "bg-blue-200" : "bg-white"} p-4 rounded-lg flex-row flex justify-between items-center m-2 py-5`}>
            <View className="flex flex-col">
              <Text className="text-black text-lg font-bold">{project.name}</Text>
              <Text className="text-black font-italic">{project.description}</Text>
            </View>
            <View>
              <IconSymbol name="chevron.right" size={24} color="black" />
            </View>
          </Pressable>
        ))}
      </Animated.View>
    </Animated.ScrollView >
  );
}
