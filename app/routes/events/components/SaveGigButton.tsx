import { useFetcher } from "@remix-run/react";

import { EventRowJson } from "~/data/models/EventRow";
import { CenteredButton } from "~/routes/events/components/CenteredButton";
import { EventsActionIntent } from "~/routes/events/route";

export function SaveGigButton({ row }: { row: EventRowJson }) {
  const { Form, state } = useFetcher();

  return (
    <Form method="post" id={row.id} className="h-full">
      <CenteredButton
        name="intent"
        value={EventsActionIntent.createEvent}
        data-testid={"SAVE_BUTTON"}>
          {state === "idle" ? "Save" : "Saving..."}
      </CenteredButton>
    </Form>
  );
}
