import axios from "axios";
import { Toast } from "toastify-react-native";


const apiKey = process.env.API_KEY || process.env.EXPO_PUBLIC_API_KEY;

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": apiKey,
  },
});

// --- Auth v3 : token du trip courant ---
// Posé par app/[id]/_layout.tsx via setTripToken, retiré au unmount via clearTripToken.
// Injecté par l'interceptor de requête sur TOUS les appels du client : les hooks ne
// posent plus le header à la main une fois migrés (x-user-id → x-user-token, Phase 3).
// Pendant la migration, cohabite avec les x-user-id historiques : v1 ignore x-user-token.
// Limites assumées : un seul trip actif à la fois (la home ne mute rien) ;
// leave et rotate-token doivent clear/re-set (Phase 6).
let currentTripToken = null;

export const setTripToken = (token) => {
  currentTripToken = token || null;
};

export const clearTripToken = () => {
  currentTripToken = null;
};

client.interceptors.request.use(config => {
  if (currentTripToken) {
    config.headers = { ...config.headers, "x-user-token": currentTripToken };
  }
  return config;
}, (error) => handleError(error));
client.interceptors.response.use(response => response, (error) => handleError(error));




const handleError = (error) => {
  if (error?.response) {
    const { status, config } = error.response;
    // Statuts attendus pour cette requête (config.skipToastStatuses, ex. 404 du
    // migrate = trip supprimé côté serveur) : pas de toast, le caller gère lui-même.
    if (!config?.skipToastStatuses?.includes(status)) {
      switch (status) {
        case 401:
          Toast.error("Non autorisé");
          break;
        case 403:
          Toast.error("Accès interdit");
          break;
        case 404:
          Toast.error("Ressource introuvable");
          break;
        case 500:
          Toast.error("Erreur serveur");
          break;
        default:
          Toast.error(`Erreur ${status}`);
      }
    }
    console.error(`HTTP ${status} ${config?.url}`);
    throw error;
  } else if (error?.request) {
    Toast.error("Impossible de contacter le serveur");
    throw error;
  } else {
    Toast.error("Erreur inattendue");
    throw error;
  }
}


export default client;