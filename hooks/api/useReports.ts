import { v3Path } from "@/lib/api-v3";
import axios from "@/lib/axios";
import { ReportReason, ReportResponse, ReportSubjectType } from "@/types/responses";
import { useMutation } from "@tanstack/react-query";

/**
 * Motifs acceptes par le backend (`CONTENT_REPORT_REASONS`) : ce sont des cles,
 * le libelle FR vit cote UI. Global aux types de contenu, pas propre au chat.
 */
export const REPORT_REASONS: ReportReason[] = ["spam", "harassment", "illicit", "other"];

/**
 * Cible d'un signalement. La route est generique : c'est le couple
 * (type, id) qui designe le contenu, jamais un chemin dedie par ressource.
 */
export interface ContentReportPayload {
    subjectType: ReportSubjectType;
    /** ObjectId brut (les ids de trip restent les seuls encodes). */
    subjectId: string;
    reason: ReportReason;
    /** Precision libre optionnelle : trimmee cote serveur, 500 caracteres max. */
    comment?: string;
}

/**
 * Canal siege de signalement : `POST /trips/:tripId/reports`, membre uniquement.
 * Idempotent par membre — 201 sur un nouveau signalement, 200 + `alreadyReported`
 * sur un doublon. 404 contenu inconnu ou hors du trip, 403 auto-signalement,
 * 422 payload invalide.
 *
 * Seule surface de signalement de l'app : les appelants specialises (message,
 * puis les autres types de contenu) n'ont qu'a fournir le couple (type, id).
 */
export const reportContent = async (tripId: string, { subjectType, subjectId, reason, comment }: ContentReportPayload): Promise<ReportResponse> => {
    const response = await axios.post(v3Path(`/trips/${tripId}/reports`), { subjectType, subjectId, reason, comment });
    return response.data;
}

/**
 * Mutation de signalement pour les sujets qui n'ont pas d'etat « deja signale »
 * dans le cache (aujourd'hui `event` : l'API n'expose `reportedByMe` que pour
 * les messages, cf. `useReportMessage`).
 */
export const useReportContent = (tripId: any, userId?: string) => {
    return useMutation<ReportResponse, Error, ContentReportPayload>({
        mutationFn: (payload) => {
            if (!tripId || !userId) {
                throw new Error("User ID is required to report content");
            }
            return reportContent(tripId, payload);
        }
    });
}
