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

client.interceptors.request.use(config => config, (error) => handleError(error));
client.interceptors.response.use(response => response, (error) => handleError(error));



const handleError = (error) => {
  if (error?.response) {
    const { status, config } = error.response;
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
    console.error(`HTTP ${status} ${config?.url}`, error.response?.data);
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