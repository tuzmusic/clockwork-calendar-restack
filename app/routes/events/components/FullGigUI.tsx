import dayjs from "dayjs";

import FullCalendarGig from "~/data/models/FullCalendarGig";
import { GigPartUI } from "~/routes/events/components/GigPartUI";


export function FullGigUI({ gig }: { gig: ReturnType<FullCalendarGig["serialize"]> }) {
  const date = dayjs(gig.parts[0].startDateTime).format("M/D/YYYY");

  return (
    <div className="border-gray-300 border p-2 rounded-md ">
      <div className="flex justify-between">
        <span className="font-bold">{date}</span>
        <span>{gig.location}</span>
      </div>
      <ul>
        {gig.parts.map(part => (
          <GigPartUI key={part.type} part={part} />)
        )}
      </ul>
    </div>
  );
}
