import { EventRowJson } from "~/data/models/EventRow";
import { TextButton } from "~/routes/events/components/TextButton";
import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

export function GetDistanceInfoButton({ row }: { row: EventRowJson }) {
  // hm, useNavigation.state() doesn't update here like you would think it should
  return (
    // NOTE we are using the actual action string here,
    //  so we can't use GigActionButton which uses its own fetcher.
    <form method="post" action="/events">
      <input name="gig" type="hidden" value={JSON.stringify(row.appGig)} />
      <TextButton
        data-testid="GET_DISTANCE_INFO_BUTTON"
        name="intent" value={EventsActionIntent.getDistanceInfo}
      >
        Get distance info
      </TextButton>
    </form>
  );
}
