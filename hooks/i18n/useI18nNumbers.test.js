
import useI18nNumbers from "./useI18nNumbers";


describe("Validate formatPercent", () => {


    it("Validate null values", async () => {

        const { formatPercent } = useI18nNumbers();
        expect(formatPercent(null)).toBe("0 %");

    })


    it("Validate  values", async () => {

        const { formatPercent } = useI18nNumbers();

        // expect(formatPercent(0.25)).toBe("25 %");
        // expect(formatPercent(0.856)).toBe("85,6 %");
        // expect(formatPercent(0.153)).toBe("15 %");

    })

});