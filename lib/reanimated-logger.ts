// Bruit dev Reanimated >= 4.6 : @gorhom/bottom-sheet 5.x passe encore des
// tableaux `dependencies` aux hooks (28 sites, gorhom/react-native-bottom-sheet#2785,
// non corrige a ce jour), ce qui spamme "[Reanimated] Dependencies should only
// be used on the web..." au demarrage. Ces deps sont ignorees par Reanimated
// sur natif : aucun impact comportemental, pur bruit de console.
//
// L'API publique (configureReanimatedLogger) ne gere que level/strict — pas de
// filtrage par message — d'ou ce filtre chirurgical sur console.warn. Tout le
// reste traverse (y compris les autres warnings Reanimated).
// A retirer quand bottom-sheet corrige le bug en amont.
if (__DEV__) {
  const nativeWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === "string" &&
      first.startsWith("[Reanimated]") &&
      first.includes("Dependencies should only be used on the web")
    ) {
      return;
    }
    nativeWarn(...args);
  };
}
