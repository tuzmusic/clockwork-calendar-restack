import FullCalendarGig from "~/data/models/FullCalendarGig";

export function FullGigUI({ gig }: { gig: ReturnType<FullCalendarGig["serialize"]> }) {
  return (
    <div>
      <div>{gig.location}</div>
      <ul>
        {gig.parts.map(part =>
          <li key={part.type}>
            {part.type}: {part.startDateTime} - {part.endDateTime}
          </li>
        )}
      </ul>
    </div>
  );
}
