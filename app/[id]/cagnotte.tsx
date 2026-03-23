import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";
import { Alert, Image, Linking, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";

export default function Cagnotte({ 
    tripName = "le voyage", 
    tripImage = null 
}) {
    // 1. État pour le champ de saisie
    const [inputValue, setInputValue] = useState(""); 
    
    // 2. État sous forme de tableau pour stocker plusieurs cagnottes
    // Chaque cagnotte aura un identifiant unique (id) et une URL (url)
    const [cagnottes, setCagnottes] = useState([]);

    // Ajouter une nouvelle cagnotte
    const handleValidate = () => {
        if (inputValue.trim() === "") {
            Alert.alert("Oups", "Veuillez entrer un lien valide.");
            return;
        }
        
        // On crée un nouvel objet cagnotte avec un ID unique (basé sur l'heure actuelle)
        const newCagnotte = {
            id: Date.now().toString(),
            url: inputValue.trim()
        };

        // On l'ajoute au tableau existant
        setCagnottes([...cagnottes, newCagnotte]);
        setInputValue(""); // On vide le champ
    };

    // Supprimer une cagnotte avec confirmation
    const handleDelete = (idToRemove) => {
        Alert.alert(
            "Supprimer",
            "Etes-vous sur de vouloir supprimer cette Cagnotte ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Oui",
                    style: "destructive",
                    onPress: () => {
                        setCagnottes(cagnottes.filter(cagnotte => cagnotte.id !== idToRemove));
                    }
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

    // Deviner la plateforme
    const getPlatformName = (url) => {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes("tricount")) return "Tricount";
        if (lowerUrl.includes("airbnb")) return "Airbnb";
        if (lowerUrl.includes("leetchi")) return "Leetchi";
        return "le lien";
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FBF7DC] dark:bg-slate-950">
            <ScrollView className="flex-1 px-4 pt-4">
                
                {/* SECTION 1 : LISTE DES CAGNOTTES ACTIVES */}
                {cagnottes.length > 0 && (
                    <View className="space-y-4 mb-6">
                        {/* Gros titre Bold, Noir, Non Italique */}
                        <Text className="text-2xl font-black text-slate-900 dark:text-white px-1">
                            Cagnottes actives
                        </Text>
                        
                        {/* On boucle sur notre tableau pour afficher chaque cagnotte */}
                        {cagnottes.map((cagnotte) => (
                            <View key={cagnotte.id} className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm mb-4 border border-gray-100 dark:border-slate-800">
                                
                                {/* LE RESTE DES INFOS DANS LA CARTE ÉPURÉE */}
                                <View className="flex-row items-start justify-between">
                                    <View className="flex-row gap-4 items-center flex-1 pr-2">
                                        {tripImage ? (
                                            <Image 
                                                source={typeof tripImage === 'string' ? { uri: tripImage } : tripImage} 
                                                className="w-12 h-12 rounded-full" 
                                            />
                                        ) : (
                                            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                                                <IconSymbol name="eurosign.circle" size={24} color="blue" />
                                            </View>
                                        )}
                                        
                                        <View className="flex-1">
                                            {/* CHANGEMENT ICI : Texte un poil plus gros et bien noir pour le titre de la carte */}
                                            <Text className="text-xl font-bold text-slate-900 dark:text-slate-100" numberOfLines={2}>
                                                Dépenses {tripName}
                                            </Text>
                                            <View className="flex-row items-center gap-1.5 mt-0.5">
                                                <IconSymbol name="link" size={16} color="blue" />
                                                <Text className="text-sm font-semibold uppercase text-blue-500" numberOfLines={1}>
                                                    {getPlatformName(cagnotte.url)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    
                                    {/* Bouton de suppression */}
                                    <Pressable 
                                        onPress={() => handleDelete(cagnotte.id)}
                                        className="p-2 active:opacity-50"
                                    >
                                        <IconSymbol name="trash" size={24} color="#ef4444" />
                                    </Pressable>
                                </View>
                                
                                {/* Bouton "Ouvrir" bleu arrondi, calqué sur ton rendu */}
                                <Pressable 
                                    onPress={() => handleOpenLink(cagnotte.url)}
                                    className="w-full bg-blue-500 py-3 rounded-lg flex-row items-center justify-center gap-2 active:bg-blue-600 mt-4 shadow-sm"
                                >
                                    <Text className="text-white font-bold text-lg">
                                        Ouvrir dans {getPlatformName(cagnotte.url)}
                                    </Text>
                                    <IconSymbol name="arrow.up.right" size={18} color="white" />
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}

                {/* SECTION 2 : FORMULAIRE D'AJOUT */}
                <View className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-blue-500/10 shadow-sm mb-10 gap-4">
                    <View className="flex-row items-center gap-2">
                        {/* Gros titre Bold, Noir, Non Italique pour l'ajout */}
                        <Text className="text-2xl font-black text-slate-900 dark:text-white">
                            Ajouter une cagnotte
                        </Text>
                    </View>
                    
                    {/* Texte de description légèrement plus grand pour la lisibilité */}
                    <Text className="text-base text-slate-500 dark:text-slate-400">
                        Liez un lien Airbnb, Leetchi ou Tricount pour centraliser les dépenses du groupe.
                    </Text>
                    
                    <View className="mt-2 gap-3">
                        <View className="justify-center">
                            <View className="absolute left-3 z-10">
                                <IconSymbol name="link" size={20} color="#94a3b8" />
                            </View>
                            <TextInput 
                                className="w-full pl-10 pr-4 py-3 bg-[#FBF7DC] dark:bg-slate-800 rounded-lg text-lg font-medium text-slate-900 dark:text-white"
                                placeholder="https://www.tricount.com/..."
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="none"
                                value={inputValue}
                                onChangeText={setInputValue} 
                            />
                        </View>
                        
                        <Pressable 
                            onPress={handleValidate}
                            className="w-full bg-slate-900 dark:bg-blue-500 py-3 rounded-lg items-center active:opacity-80"
                        >
                            <Text className="text-white font-bold text-lg">Valider</Text>
                        </Pressable>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}