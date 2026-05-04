import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { usePostLinkPreview } from "@/hooks/api/useLinkPreview";
import { useGetTrip, useUpdateTrip } from "@/hooks/api/useTrips";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Alert, Image, Linking, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";

export default function Expenses() { 
    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    
    // Les hooks API
    const updateTrip = useUpdateTrip(String(id)); 
    const postLinkPreview = usePostLinkPreview();

    const [inputValue, setInputValue] = useState(""); 
    
    const { control } = useForm({
        values: {
            expensesList: trip?.expensesList || []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "expensesList"
    });

    const saveToDB = async (newList) => {
        if (updateTrip && trip) {
            try {
                await updateTrip.mutateAsync({ 
                    ...trip, 
                    expensesList: newList 
                });
            } catch (error) {
                console.error("Erreur lors de la sauvegarde :", error);
                Alert.alert("Erreur", "La sauvegarde a échoué.");
            }
        }
    };

    const handleValidate = async () => {
        const url = inputValue.trim();
        if (url === "") {
            Alert.alert("Oups", "Veuillez entrer un lien valide.");
            return;
        }
        
        let finalName = "Cagnotte";
        let finalImage = null;

        // Appel au service backend de ton pote pour récupérer la preview
        try {
            const response = await postLinkPreview.mutateAsync(url);
            if (response) {
                // On s'adapte aux infos renvoyées par l'API
                finalName = response.siteName || response.title || "Cagnotte";
                finalImage = response.image || null;
            }
        } catch (error) {
            console.warn("Impossible de récupérer les infos via l'API", error);
        }

        const newEntry = { 
            url: url, 
            siteName: finalName,
            image: finalImage
        };

        append(newEntry);
        
        // On sauvegarde directement la nouvelle liste combinée
        const currentList = fields.map(f => ({ url: f.url, siteName: f.siteName, image: f.image }));
        await saveToDB([...currentList, newEntry]);

        setInputValue(""); 
    };

    const handleDelete = (indexToRemove) => {
        Alert.alert(
            "Supprimer",
            "Êtes-vous sûr de vouloir supprimer cette cagnotte ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Oui",
                    style: "destructive",
                    onPress: async () => {
                        // FIX: On calcule la nouvelle liste AVANT de faire le remove
                        const newList = fields
                            .filter((_, i) => i !== indexToRemove)
                            .map(f => ({ url: f.url, siteName: f.siteName, image: f.image }));
                        
                        remove(indexToRemove);
                        await saveToDB(newList);
                    }
                }
            ]
        );
    };

    const handleOpenLink = async (url) => {
        // FIX: Validation du lien web
        if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
            Alert.alert("Erreur", "Lien invalide. Il doit commencer par http:// ou https://");
            return;
        }
        
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

    return (
        <SafeAreaView className="flex-1 bg-[#FBF7DC] dark:bg-gray-950">
            <ScrollView className="flex-1 px-4 pt-4">
                
                {fields.length > 0 && (
                    <View className="space-y-4 mb-6">
                        <Text className="text-2xl font-black text-gray-900 dark:text-white px-1">
                            Cagnottes actives
                        </Text>
                        
                        {fields.map((field, index) => (
                            <View key={field.id} className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm mb-4 border border-gray-100 dark:border-gray-800">
                                
                                <View className="flex-row items-start justify-between">
                                    <View className="flex-row gap-4 items-center flex-1 pr-2">
                                        <View className="flex-1">
                                            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                Cagnotte
                                            </Text>
                                            <View className="flex-row items-center gap-2 mt-0.5">
                                                {field.image ? (
                                                    <Image source={{ uri: field.image }} style={{ width: 16, height: 16, borderRadius: 4 }} />
                                                ) : (
                                                    <IconSymbol name="link" size={16} color="blue" />
                                                )}
                                                <Text className="text-sm font-semibold uppercase text-blue-500" numberOfLines={1}>
                                                    {field.siteName}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    
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
                                        Ouvrir dans {field.siteName}
                                    </Text>
                                    <IconSymbol name="arrow.up.right" size={18} color="white" />
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}

                <View className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 mb-10">
                    <View className="flex-row items-center gap-2">
                        <Text className="text-2xl font-black text-gray-900 dark:text-white">
                            Ajouter une cagnotte
                        </Text>
                    </View>
                    
                    <Text className="text-base text-gray-500 dark:text-gray-400 mt-2">
                        Liez un lien Tricount, Splid, Lydia, Tribee ou Leetchi pour centraliser les dépenses du groupe.
                    </Text>
                    
                    <View className="mt-4 gap-3">
                        <View className="flex-row items-center bg-[#FBF7DC] dark:bg-gray-800 rounded-lg pl-3 pr-1">
                            <IconSymbol name="link" size={20} color="#94a3b8" />
                            <TextInput 
                                className="flex-1 py-3 ml-2 pr-3 text-lg font-medium text-gray-900 dark:text-white"
                                placeholder="https://www.tricount.com/..."
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="none"
                                value={inputValue}
                                onChangeText={setInputValue} 
                            />
                        </View>
                    </View>
                        
                    <View className="mt-4">
                        <Button 
                            variant="contained" 
                            title={postLinkPreview?.isPending || updateTrip?.isPending ? "Traitement..." : "Valider"} 
                            onPress={handleValidate} 
                            disabled={postLinkPreview?.isPending || updateTrip?.isPending}
                        />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}