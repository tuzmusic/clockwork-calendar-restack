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
import { getOAuthClient } from "~/data/getOAuthClient";
import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";

export async function loader(
  args: LoaderFunctionArgs,
  _emailService?: EmailService,
  _calendarService?: CalendarService
) {
  const useFixture = new URL(args.request.url).searchParams.get("useFixture");
  if (useFixture && useFixture !== "false") {
    return { eventRowsJson: getFixture() };
  }

  const { isAuthenticated, userId } = await getAuth(args);

  // Protect the route by checking if the user is signed in
  if (!isAuthenticated) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  const calendarId = await selectedCalendarCookie.parse(
    args.request.headers.get("Cookie")
  );
  if (!calendarId) throw redirect("/select-calendar");

  const distanceService = new DistanceService();
  const { CLERK_SECRET_KEY } = process.env;

  const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });
  const user = await clerkClient.users.getUser(userId);
  const oauth2Client = await getOAuthClient(user, clerkClient);

  const emailService = _emailService ?? new GmailService(oauth2Client); // new EmailFixtureService();
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

  const eventRowsJson = schedule.eventSets.map(set => set.serialize());
  return { eventRowsJson };
}
