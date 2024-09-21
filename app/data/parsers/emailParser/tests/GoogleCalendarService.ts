import dayjs from "dayjs";
import { calendar_v3, google } from "googleapis";

import { oauth2Client } from "~/auth/auth0.server";
import CalendarService from "~/data/services/CalendarService";

export default class GoogleCalendarService extends CalendarService {
  async getEvents(
    calendarId: string,
    { fromDate }: { fromDate: Date | null }
  ): Promise<calendar_v3.Schema$Event[]> {
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client
    });

    const calResponse = await calendar.events.list({
      calendarId,
      singleEvents: true,
      q: "Clockwork Gig",
      orderBy: "startTime",
      timeMin: (fromDate ? dayjs(fromDate) : dayjs()).toISOString()
    });

    // todo: error reporting
    return calResponse?.data?.items ?? [];
  }
}
