import DayJsTz from "~/data/models/DayJsTz";
import { GigPartJSON } from "~/data/models/GigParts/GigPart";

export function GigPartUI({ part }: { part: GigPartJSON }) {
  const { actualEndDateTime, startDateTime, actualStartDateTime, endDateTime, type } = part;
  const [start, end, actualStart, actualEnd] = [startDateTime, endDateTime, actualStartDateTime, actualEndDateTime].map(
    d => DayJsTz(d).format("h:mm A")
  );

  const showActual = (start !== actualStart) || (end !== actualEnd);

  return (
    <li className="capitalize flex justify-between" key={type}>
      <div>{type}:</div>
      <div className="text-right">
        <div>{start}-{end}</div>
        {(showActual) ? <div className="text-xs">(&quot;{actualStart}-{actualEnd}&quot;)</div> : null}
      </div>
    </li>
  );
}
