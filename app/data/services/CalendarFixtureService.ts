import { GaxiosResponse } from "gaxios";
import { calendar_v3 } from "googleapis";

import CalendarService from "~/data/services/CalendarService";

export default class CalendarFixtureService extends CalendarService {
  public async postEvent(json: calendar_v3.Schema$Event): Promise<
    GaxiosResponse<calendar_v3.Schema$Event>
  > {
    return Promise.resolve({
      data: json,
      config: {},
      headers: {},
      request: { responseURL: "" },
      status: 200,
      statusText: ""
    });
  }
}
