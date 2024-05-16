import DayJsTz from "~/data/models/DayJsTz";
import { GigPartJSON } from "~/data/models/GigParts/GigPart";

export function GigPartUI({ part }: { part: GigPartJSON }) {
  const { actualEndDateTime, startDateTime, actualStartDateTime, endDateTime, type } = part;
  const [writtenStart, writtenEnd, actualStart, actualEnd] = [startDateTime, endDateTime, actualStartDateTime, actualEndDateTime].map(
    d => DayJsTz(d).format("h:mma")
  );

  const showWritten = (writtenStart !== actualStart) || (writtenEnd !== actualEnd);

  return (
    <li className="capitalize flex justify-between" key={type}>
      <div>{type}:</div>
      <div className="text-right">
        <div>{actualStart}-{actualEnd}</div>
        {(showWritten) ? <div className="text-xs">(&quot;{writtenStart}-{writtenEnd}&quot;)</div> : null}
      </div>
    </li>
  );
}
