import { useFetcher } from "@remix-run/react";

import { EventRowJson } from "~/data/models/EventRow";
import { CenteredButton } from "~/routes/events/components/CenteredButton";
import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

export function GigActionButton({
  row, intent, idleText, testId, loadingText
}: {
  row: EventRowJson
  intent: EventsActionIntent
  idleText: string
  loadingText: string
  testId?: string
}) {
  const { Form, state } = useFetcher();

  return (
    <Form method="post" id={row.id} className="h-full">
      <input type="hidden" name="gig" value={JSON.stringify(row.appGig)} />
      <CenteredButton
        name="intent"
        value={intent}
        {...testId && { "data-testid": testId }}
      >
        {state === "idle" ? idleText : loadingText}
      </CenteredButton>
    </Form>
  );
}

