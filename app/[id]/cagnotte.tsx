import { Button } from "@/components/ui/Button"; // ⚠️ Vérifie que le chemin du composant Button est le bon
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Alert, Image, Linking, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { useGetTrip } from "../hooks/useTrips"; // ⚠️ Vérifie que le chemin vers ton hook est le bon

// 1. La fonction n'a plus d'arguments et s'appelle Expenses
export default function Expenses() { 
    // 2. On récupère les infos du voyage via le Hook de ton pote
    const { id } = useLocalSearchParams();
    const trip = useGetTrip(id);

    // État pour le champ de saisie
    const [inputValue, setInputValue] = useState(""); 
    
    // 3. Initialisation de react-hook-form pour gérer la liste sans utiliser Date.now()
    const { control } = useForm({
        defaultValues: {
            expensesList: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "expensesList"
    });

    // Ajouter une nouvelle cagnotte
    const handleValidate = () => {
        if (inputValue.trim() === "") {
            Alert.alert("Oups", "Veuillez entrer un lien valide.");
            return;
        }
        
        // On utilise "append" pour ajouter proprement, l'ID est géré automatiquement
        append({ url: inputValue.trim() });
        setInputValue(""); // On vide le champ
    };

    // Supprimer une cagnotte avec confirmation (on utilise l'index de react-hook-form)
    const handleDelete = (indexToRemove) => {
        Alert.alert(
            "Supprimer",
            "Êtes-vous sûr de vouloir supprimer cette cagnotte ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Oui",
                    style: "destructive",
                    onPress: () => remove(indexToRemove)
                }
            ]
        );
    };

    // Ouvrir le lien
    const handleOpenLink = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Erreur", "Impossible d'ouvrir ce lien.");
            }
        } catch (error) {
            Alert.alert("Erreur", "Lien invalide.");
        }
    };

    // Deviner la plateforme (Airbnb supprimé, nouvelles plateformes ajoutées)
    const getPlatformName = (url) => {
        if (!url) return "le lien";
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes("tricount")) return "Tricount";
        if (lowerUrl.includes("leetchi")) return "Leetchi";
        if (lowerUrl.includes("splid")) return "Splid";
        if (lowerUrl.includes("tribee")) return "Tribee";
        if (lowerUrl.includes("lydia")) return "Lydia";
        return "le lien";
    };

    return (
        // 4. On a remplacé tous les "slate" par "gray" pour le mode sombre
        <SafeAreaView className="flex-1 bg-[#FBF7DC] dark:bg-gray-950">
            <ScrollView className="flex-1 px-4 pt-4">
                
                {/* SECTION 1 : LISTE DES CAGNOTTES ACTIVES */}
                {fields.length > 0 && (
                    <View className="space-y-4 mb-6">
                        <Text className="text-2xl font-black text-gray-900 dark:text-white px-1">
                            Cagnottes actives
                        </Text>
                        
                        {/* On boucle sur fields au lieu de cagnottes */}
                        {fields.map((field, index) => (
                            <View key={field.id} className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm mb-4 border border-gray-100 dark:border-gray-800">
                                
                                <View className="flex-row items-start justify-between">
                                    <View className="flex-row gap-4 items-center flex-1 pr-2">
                                        
                                        {/* 5. Utilisation de l'image propre issue du hook */}
                                        {trip?.image ? (
                                            <Image 
                                                source={{ uri: trip.image }} 
                                                className="w-12 h-12 rounded-full" 
                                            />
                                        ) : (
                                            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                                                <IconSymbol name="eurosign.circle" size={24} color="blue" />
                                            </View>
                                        )}
                                        
                                        <View className="flex-1">
                                            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100" numberOfLines={2}>
                                                Dépenses {trip?.name || "du voyage"}
                                            </Text>
                                            <View className="flex-row items-center gap-1.5 mt-0.5">
                                                <IconSymbol name="link" size={16} color="blue" />
                                                <Text className="text-sm font-semibold uppercase text-blue-500" numberOfLines={1}>
                                                    {getPlatformName(field.url)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    
                                    {/* Bouton de suppression */}
                                    <Pressable 
                                        onPress={() => handleDelete(index)}
                                        className="p-2 active:opacity-50"
                                    >
                                        <IconSymbol name="trash" size={24} color="#ef4444" />
                                    </Pressable>
                                </View>
                                
                                <Pressable 
                                    onPress={() => handleOpenLink(field.url)}
                                    className="w-full bg-blue-500 py-3 rounded-lg flex-row items-center justify-center gap-2 active:bg-blue-600 mt-4 shadow-sm"
                                >
                                    <Text className="text-white font-bold text-lg">
                                        Ouvrir dans {getPlatformName(field.url)}
                                    </Text>
                                    <IconSymbol name="arrow.up.right" size={18} color="white" />
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}

                {/* SECTION 2 : FORMULAIRE D'AJOUT */}
                <View className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-blue-500/10 shadow-sm mb-10 gap-4">
                    <View className="flex-row items-center gap-2">
                        <Text className="text-2xl font-black text-gray-900 dark:text-white">
                            Ajouter une cagnotte
                        </Text>
                    </View>
                    
                    <Text className="text-base text-gray-500 dark:text-gray-400">
                        Liez un lien Tricount, Splid, Lydia, Tribee ou Leetchi pour centraliser les dépenses du groupe.
                    </Text>
                    
                    <View className="mt-2 gap-3">
                        <View className="justify-center">
                            <View className="absolute left-3 z-10">
                                <IconSymbol name="link" size={20} color="#94a3b8" />
                            </View>
                            <TextInput 
                                className="w-full pl-10 pr-4 py-3 bg-[#FBF7DC] dark:bg-gray-800 rounded-lg text-lg font-medium text-gray-900 dark:text-white"
                                placeholder="https://www.tricount.com/..."
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="none"
                                value={inputValue}
                                onChangeText={setInputValue} 
                            />
                        </View>
                        
                        {/* 6. Utilisation du composant Button officiel */}
                        <Button 
                            variant="contained" 
                            title="Valider" 
                            onPress={handleValidate} 
                        />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}