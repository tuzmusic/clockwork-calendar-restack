import { calendar_v3 } from "googleapis";

export const simpleEvent: calendar_v3.Schema$Event = {
  kind: "calendar#event",
  etag: "\"3379200766014000\"",
  id: "206lq2hfk0vk9tqj5flpcq0afm",
  status: "confirmed",
  htmlLink:
    "https://www.google.com/calendar/event?eid=MjA2bHEyaGZrMHZrOXRxajVmbHBjcTBhZm0gZXY4cGY5cGU0cDk4cmRlYWk2NnJmdDVhNWNAZw",
  created: "2023-07-17T13:26:23.000Z",
  updated: "2023-07-17T13:26:23.007Z",
  summary: "Clockwork Gig ",
  location: "Private Residence, Wilton, CT",
  creator: {
    email: "tuzmusic@gmail.com"
  },
  organizer: {
    email: "ev8pf9pe4p98rdeai66rft5a5c@group.calendar.google.com",
    displayName: "Holly and Jonathan's Calendar",
    self: true
  },
  start: {
    dateTime: "2024-08-24T20:00:00-04:00",
    timeZone: "America/New_York"
  },
  end: {
    dateTime: "2024-08-25T00:00:00-04:00",
    timeZone: "America/New_York"
  },
  iCalUID: "206lq2hfk0vk9tqj5flpcq0afm@google.com",
  sequence: 0,
  reminders: {
    useDefault: true
  },
  eventType: "default"
};
