import { EventRowJson } from "~/data/models/EventRow";

export function getFixture(): EventRowJson[] {
  return [
    {
      emailGig: {
        id: "2024-07-08",
        location: "Some location",
        parts: [
          {
            type: "reception",
            startDateTime: "2024-07-08T18:00:00",
            endDateTime: "2024-07-08T22:30:00",
            actualStartDateTime: "2024-07-08T18:00:00",
            actualEndDateTime: "2024-07-08T22:30:00"
          }
        ],
        originalHtml: "<tr>\n        <td>&nbsp;</td>\n        <td><strong>8</strong></td>\n        <td>&nbsp;</td>\n        <td> 6:00-10:30 \n        </td>\n        <td>\n          <strong>CEC</strong> &nbsp;\n          Some location\n        </td>\n      </tr>"
      },
      googleGig: {
        startDateTime: "2024-07-08T18:00:00",
        endDateTime: "2024-07-08T22:30:00",
        id: "2024-07-08",
        location: "Some location"
      },
      appGig: {
        id: "2024-07-08",
        location: "Some location",
        parts: [
          {
            type: "reception",
            startDateTime: "2024-07-08T18:00:00",
            endDateTime: "2024-07-08T22:30:00",
            actualStartDateTime: "2024-07-08T18:00:00",
            actualEndDateTime: "2024-07-08T22:30:00"
          }
        ],
        distanceInfo: null
      },
      id: "2024-07-08",
      hasChanged: false,
      hasUpdates: false
    },
    {
      emailGig: {
        id: "2024-07-09",
        location: "Some location",
        parts: [
          {
            type: "ceremony",
            startDateTime: "2024-07-09T16:00:00",
            endDateTime: "2024-07-09T17:00:00",
            actualStartDateTime: "2024-07-09T15:30:00",
            actualEndDateTime: "2024-07-09T17:00:00"
          },
          {
            type: "cocktail hour",
            startDateTime: "2024-07-09T17:00:00",
            endDateTime: "2024-07-09T18:00:00",
            actualStartDateTime: "2024-07-09T17:00:00",
            actualEndDateTime: "2024-07-09T18:00:00"
          },
          {
            type: "reception",
            startDateTime: "2024-07-09T18:00:00",
            endDateTime: "2024-07-09T22:30:00",
            actualStartDateTime: "2024-07-09T18:00:00",
            actualEndDateTime: "2024-07-09T22:30:00"
          }
        ],
        originalHtml: "<tr>\n        <td>&nbsp;</td>\n        <td><strong>9</strong></td>\n        <td>&nbsp;</td>\n        <td> 6:00-10:30 \n        </td>\n        <td>\n          <strong>CEC</strong> &nbsp;\n          Some location\n        </td>\n      </tr><tr>\n  <td colspan=\"3\" valign=\"top\">&nbsp;</td>\n  <td colspan=\"2\" valign=\"top\">\n    <span style=\"\n        color: #00f;\n        font-style: italic;\n        font-size: 11px;\n      \">\n      <strong>Ceremony</strong>,\n      4:00-5:00: Jonathan (Keys)\n    </span>\n  </td>\n</tr><tr>\n  <td colspan=\"3\" valign=\"top\">&nbsp;</td>\n  <td colspan=\"2\" valign=\"top\">\n    <span style=\"\n        color: #00f;\n        font-style: italic;\n        font-size: 11px;\n      \">\n      <strong>Cocktail Hour</strong>,\n      5:00-6:00: Jonathan (Keys)\n    </span>\n  </td>\n</tr>"
      },
      googleGig: {
        startDateTime: "2024-07-09T16:30:00",
        endDateTime: "2024-07-09T22:30:00",
        id: "2024-07-09",
        location: "Some location"
      },
      appGig: {
        id: "2024-07-09",
        location: "Some location",
        parts: [
          {
            type: "ceremony",
            startDateTime: "2024-07-09T16:00:00",
            endDateTime: "2024-07-09T17:00:00",
            actualStartDateTime: "2024-07-09T15:30:00",
            actualEndDateTime: "2024-07-09T17:00:00"
          },
          {
            type: "cocktail hour",
            startDateTime: "2024-07-09T17:00:00",
            endDateTime: "2024-07-09T18:00:00",
            actualStartDateTime: "2024-07-09T17:00:00",
            actualEndDateTime: "2024-07-09T18:00:00"
          },
          {
            type: "reception",
            startDateTime: "2024-07-09T18:00:00",
            endDateTime: "2024-07-09T22:30:00",
            actualStartDateTime: "2024-07-09T18:00:00",
            actualEndDateTime: "2024-07-09T22:30:00"
          }
        ],
        distanceInfo: null
      },
      id: "2024-07-09",
      hasChanged: false,
      hasUpdates: false
    },
    {
      emailGig: {
        id: "2024-08-18",
        location: "Some location",
        parts: [
          {
            type: "reception",
            startDateTime: "2024-08-18T18:00:00",
            endDateTime: "2024-08-18T22:30:00",
            actualStartDateTime: "2024-08-18T18:00:00",
            actualEndDateTime: "2024-08-18T22:30:00"
          }
        ],
        originalHtml: "<tr>\n        <td>&nbsp;</td>\n        <td><strong>18</strong></td>\n        <td>&nbsp;</td>\n        <td> 6:00-10:30 \n        </td>\n        <td>\n          <strong>CEC</strong> &nbsp;\n          Some location\n        </td>\n      </tr>"
      },
      googleGig: null,
      appGig: {
        id: "2024-08-18",
        location: "Some location",
        parts: [
          {
            type: "reception",
            startDateTime: "2024-08-18T18:00:00",
            endDateTime: "2024-08-18T22:30:00",
            actualStartDateTime: "2024-08-18T18:00:00",
            actualEndDateTime: "2024-08-18T22:30:00"
          }
        ],
        distanceInfo: null
      },
      id: "2024-08-18",
      hasChanged: false,
      hasUpdates: false
    },
    {
      emailGig: {
        id: "2024-08-19",
        location: "Some location",
        parts: [
          {
            type: "reception",
            startDateTime: "2024-08-19T18:00:00",
            endDateTime: "2024-08-19T22:30:00",
            actualStartDateTime: "2024-08-19T18:00:00",
            actualEndDateTime: "2024-08-19T22:30:00"
          }
        ],
        originalHtml: "<tr>\n        <td>&nbsp;</td>\n        <td><strong>19</strong></td>\n        <td>&nbsp;</td>\n        <td> 6:00-10:30 \n        </td>\n        <td>\n          <strong>CEC</strong> &nbsp;\n          Some location\n        </td>\n      </tr>"
      },
      googleGig: null,
      appGig: {
        id: "2024-08-19",
        location: "Some location",
        parts: [
          {
            type: "reception",
            startDateTime: "2024-08-19T18:00:00",
            endDateTime: "2024-08-19T22:30:00",
            actualStartDateTime: "2024-08-19T18:00:00",
            actualEndDateTime: "2024-08-19T22:30:00"
          }
        ],
        distanceInfo: null
      },
      id: "2024-08-19",
      hasChanged: false,
      hasUpdates: false
    }
  ];
}
