import { FullCalendarGigJson } from "~/data/models/FullCalendarGig";
import { CenteredButton } from "~/routes/events/components/CenteredButton";
import { EventsActionIntent, PATH as eventsPath } from "~/routes/events/route";

export function GetDistanceInfoButton({ gig }: { gig: FullCalendarGigJson }) {
  return (
    <form method="post" action={eventsPath}>
      <input name="gig" type="hidden" value={JSON.stringify(gig)} />
      <CenteredButton data-testid="GET_DISTANCE_INFO_BUTTON"
                      name="intent" value={EventsActionIntent.getDistanceInfo}
      >
        Get distance info
      </CenteredButton>
    </form>
  );
}
