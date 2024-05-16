import DayJsTz from "~/data/models/DayJsTz";
import GoogleGig from "~/data/models/GoogleGig";
import { SaveButton } from "~/routes/events/components/SaveButton";

export function CalendarGigUI({ gig, hasUpdates }: { gig: ReturnType<GoogleGig["serialize"]>, hasUpdates: boolean }) {
  const [start, end] = [gig.startDateTime, gig.endDateTime].map(
    d => DayJsTz(d).format("h:mma")
  );
  const date = <>{DayJsTz(gig.id).format("M/D/YY")}</>;
  return (
    <div className="p-2 h-full flex flex-col">
      <ul className="text-right">
        <li className="font-bold">{date}</li>
        <li>{gig.location}</li>
        <li>{start}-{end}</li>
      </ul>
      {hasUpdates ?
        <div className="mt-auto ml-auto w-min">
          <SaveButton data-testid="UPDATE_BUTTON">Update</SaveButton>
        </div>
        : null}
    </div>
  );
}
