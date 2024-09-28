import { useFetcher } from "@remix-run/react";

import { EventRowJson } from "~/data/models/EventRow";
import { Button } from "~/routes/events/components/Button";

export function SaveGigButton({ row }: { row: EventRowJson }) {
  const { Form } = useFetcher();

  return <Form method="post" id={row.id}>
    <Button data-testid={"SAVE_BUTTON"}>Save</Button>
  </Form>;
}
