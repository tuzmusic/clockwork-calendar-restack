import { createRemixStub } from "@remix-run/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { getDistanceServiceWithMocks } from "~/data/models/tests/testUtils";
import { buildEvent, buildHtml, buildMonthHeader } from "~/data/parsers/emailParser/tests/htmlBuilders";
import DistanceService from "~/data/services/DistanceService";
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

const location = 'wherever'
let mockDistanceService: DistanceService

describe("Actions on the Events page", () => {
  beforeEach(() => {
    mockDistanceService = getDistanceServiceWithMocks(location);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

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
      await waitFor(() => screen.findByTestId('EVENTS_PAGE'))

      const getDistanceInfoButtons = screen.getAllByTestId('GET_DISTANCE_INFO_BUTTON')

      // neither event has distance info yet
      expect(getDistanceInfoButtons).toHaveLength(2)

      expect(mockDistanceService.getDistanceInfo).not.toHaveBeenCalled()
      fireEvent.click(getDistanceInfoButtons[0])
      expect(mockDistanceService.getDistanceInfo).toHaveBeenCalledOnce()

    });
  });
});
