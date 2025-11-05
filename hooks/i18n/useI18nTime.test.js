// import { describe, it } from "jest";
import useI18nTime from "./useI18nTime";

describe("formatRange test", () => {
    it("test des cas avec valeur null", async () => {

        const { formatRange } = useI18nTime();
        expect(formatRange(null, new Date())).toBe("");
        expect(formatRange(new Date(), null)).toBe("");
        expect(formatRange(null, null)).toBe("");
    });
    it("test des cas avec des plages de dates", async () => {

        const { formatRange } = useI18nTime(); 
        expect(formatRange("2025-11-01T00:00:00", "2026-11-10T00:00:00")).toBe("samedi 1 novembre 2025 - mardi 10 novembre 2026");
        expect(formatRange("2025-11-01T00:00:00", "2025-11-01T01:00:00")).toBe("samedi 1 novembre");
        expect(formatRange("2025-11-01T00:00:00", "2025-11-10T00:00:00")).toBe("samedi 1 - lundi 10 novembre");
        expect(formatRange("2025-11-01T00:00:00", "2025-12-10T00:00:00")).toBe("samedi 1 novembre - mercredi 10 décembre");
    });
    it("test des cas de même dates", async () => {

        const { formatRange } = useI18nTime();
        expect(formatRange("2025-11-01T00:00:00", "2025-11-01T00:00:00")).toBe("samedi 1 novembre");
    });
})

describe("formatDuration test", () => {
    it("test des cas avec valeur null", async () => {

        const { formatDuration } = useI18nTime();
        expect(formatDuration(null, null)).toBe("");
    });
    it("test des cas avec valeur null", async () => {

        const { formatDuration } = useI18nTime();
        expect(formatDuration("2025-11-01T00:00:00", "2025-11-01T01:00:00")).toBe("il y a 1 heure");
        expect(formatDuration("2025-11-01T00:00:00", "2025-11-10T00:00:00")).toBe("la semaine dernière");
        expect(formatDuration("2025-11-01T00:00:00", "2025-12-10T00:00:00")).toBe("le mois dernier");

    });
});

