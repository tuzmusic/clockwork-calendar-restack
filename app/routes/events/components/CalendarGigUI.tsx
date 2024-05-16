import DayJsTz from "~/data/models/DayJsTz";
import GoogleGig from "~/data/models/GoogleGig";

export function CalendarGigUI({ gig }: { gig: ReturnType<GoogleGig["serialize"]> }) {
  const [start,end] = [gig.startDateTime, gig.endDateTime,].map(
    d => DayJsTz(d).format("h:mma")
  );
  const date = <>{DayJsTz(gig.id).format("M/D/YY")}</>;
  return (
    <ul className="text-right p-2">
      <li className="font-bold">{date}</li>
      <li>{gig.location}</li>
      <li>{start}-{end}</li>
    </ul>
  );
}
