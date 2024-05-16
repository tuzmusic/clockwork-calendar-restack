import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "@testing-library/react";

import { buildEvent, buildHtml, buildMonthHeader } from "~/data/parsers/emailParser/tests/htmlBuilders";
import EmailService from "~/data/services/EmailService";
import eventsRoute, { loader as eventsRouteLoader } from "~/routes/events/route";

class EmailServiceMock extends EmailService {
  public async getMessageBody(): Promise<string> {
    return Promise.resolve(buildHtml(
      buildMonthHeader("July"),
      buildEvent({ dateNum: 8 }),
      buildEvent({ dateNum: 9 })
    ));
  }

}

describe("Actions on the Events page", () => {
  describe("Updating distance info for a gig", () => {
    it("Fetches the distance info and updates the event ui", async () => {
      const RemixStub = createRemixStub([
        {
          path: 'events',
          loader: (args) => eventsRouteLoader(args, new EmailServiceMock()),
          Component: eventsRoute
        }
      ])

      render(<RemixStub initialEntries={['/events']} />)
      await waitFor(() => screen.findByText('Email'))
    });
  });
});
