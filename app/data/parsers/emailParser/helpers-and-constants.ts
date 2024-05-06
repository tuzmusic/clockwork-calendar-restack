import * as cheerio from "cheerio";

export const userFirstName = "Jonathan";
export const FIRST_MONTH_ROW_INDEX = 4;
export const EVENT_CELLS_COUNT = 5;

/*
export function setStartTimeFromOtherPartTimeString(event: Event, text: string) {
  const [startTime] = getTimesFromOtherPartText(text);
  const [hours, minutes] = startTime.split(":").map(Number);
  event.startTime = event.startTime.set("hours", hours + 12);
  event.startTime = event.startTime.set("minutes", minutes);
}
*/

export function getTextFromLines(text: string) {
  return text.trim().replace(/\n\s*/g, " ");
}

export function rowsFromFetchedEmailBody($: cheerio.CheerioAPI) {
  return $("body > table > tbody").find("tr");
}

export function getTimesFromOtherPartText(text: string) {
  return text.match(/(\d{1,2}:\d{2})/g)!;
}
