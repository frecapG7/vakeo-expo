import axios from "axios";
import { Toast } from "toastify-react-native";
import { storage } from "@/storage";


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

// --- Auth v3 : token du trip ciblé par l'URL ---
// Le credential est porté par la ressource (un token par trip+user), pas global :
// l'interceptor déduit l'id du trip depuis l'URL de chaque requête et lit le token
// dans MMKV de façon synchrone, au moment exact où la requête part.
// - Plus d'état global posé par un effect du layout : l'ancien setTripToken
//   arrivait après le premier GET /trips/:id (course au montage → 403 sur les
//   trips privés, le storage n'était pas encore lu).
// - Trip public ou seat non réclamé : pas de token en stockage → pas de header,
//   lecture anonyme.
// - leave et rotate-token (Phase 6) : modifier le stockage suffit, la requête
//   suivante lit la vérité — plus de clear/re-set à orchestrer.
// - Requêtes non trip-scopées (GET /trips, POST /v3/trips, /migrate, /token/*,
//   /geocode, /link-preview) : pas de match, pas de header.
// - POST /v3/trips/batch matche le segment (« batch ») mais la clé `trips.batch`
//   n'existe pas → pas de header ; ses credentials voyagent dans le body.
// Pendant la migration, le header cohabite avec les x-user-id historiques : v1 l'ignore.
const TRIP_ID_IN_URL = /\/trips\/([^/?&#]+)/;

const getTripTokenFromUrl = (url) => {
  const id = TRIP_ID_IN_URL.exec(url ?? "")?.[1];
  if (!id)
    return null;
  try {
    const stored = storage.getString(`trips.${id}`);
    return stored ? (JSON.parse(stored)?.token ?? null) : null;
  } catch (err) {
    console.warn("Auth v3 : trip stocké illisible, requête anonyme", err);
    return null;
  }
};

client.interceptors.request.use(config => {
  const token = getTripTokenFromUrl(config.url);
  if (token) {
    config.headers = { ...config.headers, "x-user-token": token };
  }
  return config;
}, (error) => handleError(error));
client.interceptors.response.use(response => response, (error) => handleError(error));

// --- Logging des erreurs ---
// Le corps de la réponse d'erreur est la seule source du « pourquoi » (422
// fail-closed du batch, message de validation serveur) : il doit vivre dans la
// console, pas seulement le status. Le corps de requête n'est loggé qu'en dev :
// il embarque les seat tokens (batch, join) — pas de secret dans la console
// d'un build de prod.
const MAX_LOG_LENGTH = 2000;

const logPayload = (data) => {
  const text = data === undefined || data === null
    ? ""
    : typeof data === "string" ? data : (() => {
      try {
        return JSON.stringify(data);
      } catch (_err) {
        return String(data);
      }
    })();
  return text.length > MAX_LOG_LENGTH
    ? `${text.slice(0, MAX_LOG_LENGTH)}… (+${text.length - MAX_LOG_LENGTH} caractères)`
    : text;
};

const handleError = (error) => {
  if (error?.response) {
    const { status, config, data } = error.response;
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
        case 422:
          Toast.error("Données invalides");
          break;
        case 500:
          Toast.error("Erreur serveur");
          break;
        default:
          Toast.error(`Erreur ${status}`);
      }
    }
    console.error(
      `HTTP ${status} ${(config?.method ?? "").toUpperCase()} ${config?.url}`,
      `\n  ← réponse : ${logPayload(data) || "(vide)"}`,
      __DEV__ ? `\n  → requête : ${logPayload(config?.data) || "(vide)"}` : ""
    );
    throw error;
  } else if (error?.request) {
    // Timeout / serveur injoignable : trace console indispensable pour distinguer
    // ECONNABORTED (timeout 10 s) d'une vraie panne réseau.
    console.error(`Réseau ${(error?.code ?? "").trim()} ${error?.config?.url ?? ""} : ${error?.message}`);
    Toast.error("Impossible de contacter le serveur");
    throw error;
  } else {
    console.error("Erreur inattendue (setup requête)", error);
    Toast.error("Erreur inattendue");
    throw error;
  }
}


export default client;
