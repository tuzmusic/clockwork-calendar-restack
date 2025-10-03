import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { selectedCalendarCookie } from "~/auth/cookies.server";
import GoogleGig from "~/data/models/GoogleGig";
import Schedule from "~/data/models/Schedule";
import EmailParser from "~/data/parsers/emailParser/EmailParser";
import GoogleCalendarService from "~/data/parsers/emailParser/tests/GoogleCalendarService";
import AccountService from "~/data/services/AccountService.server";
import CalendarService from "~/data/services/CalendarService";
import DistanceService from "~/data/services/DistanceService";
import EmailService from "~/data/services/EmailService";
import GmailService from "~/data/services/GmailService.server";

import { getFixture } from "./page/eventRows.fixture";

export async function loader(
  args: LoaderFunctionArgs,
  _emailService?: EmailService,
  _calendarService?: CalendarService
) {
  const useFixture = new URL(args.request.url).searchParams.get("useFixture");
  if (useFixture && useFixture !== "false") {
    return { eventRowsJson: getFixture() };
  }

  await AccountService.authenticate(args.request);
  const calendarId = await selectedCalendarCookie.parse(
    args.request.headers.get("Cookie")
  );
  if (!calendarId) throw redirect("/select-calendar");

  const distanceService = new DistanceService();

  const emailService = _emailService ?? new GmailService(); // new EmailFixtureService();
  let html = "";

  // TODO: handle this in AccountService or something.
  //   GmailService throws when trying to fetch something based on the auth.
  //   If AccountService isn't throwing this, what the heck is it doing, huh?˙
  try {
    html = await emailService.getMessageBody();
  } catch {
    throw redirect("/login");
  }

  const emailGigs = EmailParser.parseEmail(html);

  const calendarService = _calendarService ?? new GoogleCalendarService(calendarId);
  const fromDate = await emailService.getMessageDate();
  const events = await calendarService.getEvents({ fromDate });
  const remoteGigs: GoogleGig[] = events.map(GoogleGig.make);
  const schedule = Schedule.build({ emailGigs, remoteGigs }, distanceService);
  await schedule.fetchDistanceInfoForNewEvents()
  const eventRowsJson = schedule.eventSets.map(set => set.serialize());
  return { eventRowsJson };
}
