import { GaxiosResponse } from "gaxios";
import { calendar_v3 } from "googleapis";

export default class CalendarService {
  public async postEvent(json: calendar_v3.Schema$Event): Promise<
    GaxiosResponse<calendar_v3.Schema$Event>
  > {
    throw Error("not implemented");
  }

  public async getEvents(
    _calendarId: string,
    _config: { fromDate: Date | null }
  ): Promise<calendar_v3.Schema$Event[]> {
    throw Error("not implemented");
  }
}
