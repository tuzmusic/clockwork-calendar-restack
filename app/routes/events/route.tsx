import { json, LoaderFunctionArgs } from "@remix-run/node";

import EmailGig from "~/data/models/EmailGig";
import GoogleGig from "~/data/models/GoogleGig";
import Schedule from "~/data/models/Schedule";
import DistanceService from "~/data/services/DistanceService";

export function loader(_args: LoaderFunctionArgs) {
  const emailGigs: EmailGig[] = [];
  const remoteGigs: GoogleGig[] = [];
  const schedule = Schedule.build({
      emailGigs,
      remoteGigs
    },
    new DistanceService()
  );
  return json({});
}

export default function Events() {
  return <h1>Hello</h1>;
}
