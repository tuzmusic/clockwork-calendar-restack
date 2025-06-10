import { useFetcher } from "@remix-run/react";

import { EventRowJson } from "~/data/models/EventRow";
import { TextButton } from "~/routes/events/components/TextButton";
import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

export function GigActionButton({
  row, intent, idleText, testId, loadingText, value
}: {
  row: EventRowJson
  intent: EventsActionIntent
  idleText: string
  loadingText: string
  testId?: string,
  value: object
}) {
  const { Form, state } = useFetcher();

  return (
    <Form method="post" id={row.id} >
      <input type="hidden" name="gig" value={JSON.stringify(value)} />
      <TextButton
        name="intent"
        value={intent}
        {...testId && { "data-testid": testId }}
      >
        {state === "idle" ? idleText : `${loadingText}...`}
      </TextButton>
    </Form>
  );
}

