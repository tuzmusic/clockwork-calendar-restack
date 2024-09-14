import DateTime from "~/data/parsers/emailParser/DateTime";
import { Month } from "~/data/parsers/emailParser/Month";

describe("DateTime", () => {
  describe("makeGoogleDateFromTime", () => {
    it.each([[1,'02'], [15,'16'], [31,'01']])("returns the following date when receiving midnight on a December %d", (inputDate, expectedDate) => {
      const timeStr = "12:00";
      const dateParts = {
        date: inputDate, month: Month.December, year: 2024
      } as const;
      const result = DateTime.makeGoogleDateFromTime(timeStr, dateParts);

      expect(result.dateTime).toEqual(`2024-${expectedDate === '01' ? '01' : '12'}-${expectedDate}T00:00:00-04:00`);
    });
  });
});
