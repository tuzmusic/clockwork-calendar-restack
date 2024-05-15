import dayjs from "dayjs";

import DayJsTz from "~/data/models/DayJsTz";
import FullCalendarGig from "~/data/models/FullCalendarGig";
import { GigPartJSON } from "~/data/models/GigParts/GigPart";


function GigPartUI({ part }: { part: GigPartJSON }) {
  const [start, end] = [part.startDateTime, part.endDateTime].map(
    d => DayJsTz(d).format("h:mm A")
  );

  return (
    <li className="capitalize flex justify-between" key={part.type}>
      <div>{part.type}:</div>
      <div>{start}-{end}</div>
    </li>
  );
}

export function FullGigUI({ gig }: { gig: ReturnType<FullCalendarGig["serialize"]> }) {
  const date = dayjs(gig.parts[0].startDateTime).format("M/D/YYYY");

  return (
    <div className="border-gray-300 border p-2 rounded-md ">
      <div>{date} {gig.location}</div>
      <ul>
        {gig.parts.map(part => (
          <GigPartUI key={part.type} part={part} />)
        )}
      </ul>
    </div>
  );
}
