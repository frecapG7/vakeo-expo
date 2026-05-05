import dayjs from "dayjs";
import { getDatesBetween, isValidUrl } from "./utils";


describe("Validate getDatesBetween", () => {

    it("Should test happy path", async () => {
        const results = getDatesBetween(dayjs("2025-01-01"), dayjs("2025-01-12"));
    })
});


describe("Validate isValidUrl", () => {

    it("Should return true for valid HTTP URLs", () => {
        expect(isValidUrl("http://example.com")).toBe(true);
        expect(isValidUrl("https://example.com")).toBe(true);
        expect(isValidUrl("https://sub.example.com/path")).toBe(true);
        expect(isValidUrl("http://example.com/path?query=value")).toBe(true);
    });

    it("Should return true for valid URLs without protocol", () => {
        expect(isValidUrl("example.com")).toBe(true);
        expect(isValidUrl("sub.example.com/path")).toBe(true);
    });

    it("Should return false for invalid URLs", () => {
        expect(isValidUrl("")).toBe(false);
        expect(isValidUrl("not a url")).toBe(false);
        expect(isValidUrl("http://")).toBe(false);
        expect(isValidUrl("example")).toBe(false);
        expect(isValidUrl("http://.com")).toBe(false);
    });

    it("Should return false for non-string inputs", () => {
        expect(isValidUrl(null)).toBe(false);
        expect(isValidUrl(undefined)).toBe(false);
        expect(isValidUrl(123)).toBe(false);
        expect(isValidUrl({})).toBe(false);
    });

    it("Should handle edge cases", () => {
        expect(isValidUrl("https://example.com:8080/path")).toBe(true);
        expect(isValidUrl("http://localhost:3000")).toBe(true);
        expect(isValidUrl("https://example.com/path-with-dashes")).toBe(true);
    });
});