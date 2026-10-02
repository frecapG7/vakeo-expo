import { type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

type ScreenProps = ViewProps & {
    /**
     * Insets consommés par le conteneur.
     * @default ["left", "right", "bottom"] — le header natif consomme le top.
     * Écran plein cadre (contenu sous le status bar) : edges={[]}.
     */
    edges?: Edge[],
};

/**
 * Conteneur d'écran standard du projet.
 *
 * Centralise le pattern safe area validé sur la home : SafeAreaView aux edges
 * gauche/droite/bas, le header natif consommant le top. Les écrans aux layouts
 * spéciaux (headers transparents, contenu sous le status bar) passent leurs
 * propres edges au lieu de contourner le composant.
 */
export const Screen = ({ children, edges = ["left", "right", "bottom"], style, ...props }: ScreenProps) => (
    <SafeAreaView style={[{ flex: 1 }, style]} edges={edges} {...props}>
        {children}
    </SafeAreaView>
);
