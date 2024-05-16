import dayjs from "dayjs";

import FullCalendarGig from "~/data/models/FullCalendarGig";
import { GigPartUI } from "~/routes/events/components/GigPartUI";

export function FullGigUI({ gig }: { gig: ReturnType<FullCalendarGig["serialize"]> }) {
  const date = dayjs(gig.parts[0].startDateTime).format("MMMM D, YYYY");

  return (
    <>
      <h3 className="flex justify-between border-b-2 align-middle p-2">
        <span className="font-bold">{date}</span>
        <span>{gig.location}</span>
      </h3>
      <ul className="p-2">
        {gig.parts.map(part => (
          <GigPartUI key={part.type} part={part} />)
        )}
      </ul>
    </>
  );
}
