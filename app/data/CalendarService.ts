import { calendar_v3 } from "googleapis";

export default class CalendarService {
  public async post(json:calendar_v3.Schema$Event): Promise<unknown> {
    return 'ok'
  }
}
