import dayjs from "dayjs";

import DayJsTz from "~/data/models/DayJsTz";
import { FullCalendarGigJson } from "~/data/models/FullCalendarGig";
import { DistanceInfo } from "~/routes/events/components/DistanceInfo";
import { GetDistanceInfoButton } from "~/routes/events/components/GetDistanceInfoButton";
import { GigPartUI } from "~/routes/events/components/GigPartUI";

export function FullGigUI({ gig }: { gig: FullCalendarGigJson }) {
  const date = dayjs(gig.parts[0].startDateTime).format("MMMM D, YYYY");
  const [startTime, endTime] = [gig.startTime, gig.endTime].map(t => DayJsTz(t).format("h:mma"));

  const [venue, ...locationParts] = gig.location.split(',')
  const location = locationParts.join()

  return (
    <div className="[&>*]:p-2">
      <h3 className="flex justify-between border-b-2 align-middle">
        <div className="font-bold">
          <div>{date}</div>
          <div>{startTime}-{endTime}</div>
        </div>
        <div className='text-right'>
          <div>{venue}</div>
          <div>{location}</div>
        </div>
      </h3>


      <ul>
        {gig.parts.map(part => (
          <GigPartUI key={part.type} part={part} />)
        )}
      </ul>

      {
        gig.distanceInfo
          ? <DistanceInfo info={gig.distanceInfo} />
          : <GetDistanceInfoButton gig={gig} />
      }
    </div>
  );
}
