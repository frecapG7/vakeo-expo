import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
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
        {mockData.map((project) => (
          <TouchableOpacity key={project.id} onPress={() => router.push(`/trips/${project.id}`)}>
            <View
              className={`${project.color} p-4 rounded-lg shadow-md flex-row flex justify-between items-center m-2`}>
              <View className="flex flex-col">
                <Text className="text-black text-lg font-bold">{project.name}</Text>
                <Text className="text-black font-italic">{project.description}</Text>
              </View>
              <View>
                <IconSymbol name="chevron.right" size={24} color="black" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </Animated.ScrollView >
  );
}
