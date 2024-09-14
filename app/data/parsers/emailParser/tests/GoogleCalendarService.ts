import { GaxiosResponse } from "gaxios";
import { calendar_v3 } from "googleapis";

import CalendarService from "~/data/services/CalendarService";

export default class GoogleCalendarService extends CalendarService {
  async getEvents(): Promise<GaxiosResponse<calendar_v3.Schema$Event[]>> {
    return super.getEvents();
  }
}
