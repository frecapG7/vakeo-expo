/**
 * Extension de la config axios pour le client partagé (lib/axios.js) :
 * `skipToastStatuses` = statuts HTTP pour lesquels handleError ne montre pas
 * de toast d'erreur (le caller gère lui-même, ex. 404 attendu du migrate v3).
 * Les autres statuts et les erreurs réseau conservent le toast par défaut.
 */
import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        skipToastStatuses?: number[];
    }
}
