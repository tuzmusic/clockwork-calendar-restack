import React, { ComponentProps, useState } from "react";

import { EventRowJson } from "~/data/models/EventRow";
import { CalendarGigUI } from "~/routes/events/components/CalendarGigUI";
import { EmailHtml } from "~/routes/events/components/EmailHtml";
import { FullGigUI } from "~/routes/events/components/FullGigUI";
import { SaveGigButton } from "~/routes/events/components/GigButtons";
import { RoundedWrapper } from "~/routes/events/components/RoundedWrapper";

const MobileWrapper = (props: ComponentProps<typeof RoundedWrapper>) =>
  <RoundedWrapper className={`hidden sm:block ${props.className ?? ""}`}>
    {props.children}
  </RoundedWrapper>;

const tabNames = ["Email", "Full", "Calendar"];
const TABS = {
  Email: ({ row }: { row: EventRowJson }) => row.emailGig ? <EmailHtml gig={row.emailGig} /> : null,
  Full: ({ row }: { row: EventRowJson }) => <FullGigUI row={row} />,
  Calendar: ({ row }: { row: EventRowJson }) => row.googleGig ?
    <CalendarGigUI row={row} hasUpdates={row.hasUpdates} /> : null
} as const;
// } satisfies Record<(typeof tabNames)[number], ({ row }: {
//   row: EventRowJson
// }) => (JSX.Element | null)>;

export function EventRowUI({ row }: { row: EventRowJson }) {
  const [selectedTab, setSelectedTab] = useState<(keyof typeof TABS)[number]>("Full");
  const MainComponent = TABS[selectedTab]
  return <React.Fragment key={row.id}>
    <MobileWrapper className={"bg-amber-500 sm:bg-amber-200"}>
      {row.emailGig ? <EmailHtml gig={row.emailGig} /> : null}
    </MobileWrapper>

    <div>
      <RoundedWrapper>
        <MainComponent row={row} />

      </RoundedWrapper>

      <div className="flex">
        {tabNames.map(name => (
          <Tab
            name={name}
            selected={selectedTab === name}
            key={name}
            onSelect={() => setSelectedTab(name)}
          />
        ))}
      </div>
    </div>

    <MobileWrapper className={"bg-blue-600 sm:bg-blue-200"}>
      {row.googleGig
        ? <CalendarGigUI row={row} hasUpdates={row.hasUpdates} />
        : <SaveGigButton row={row} />}
    </MobileWrapper>
  </React.Fragment>;
}

function Tab(props: { name: string, selected: boolean, onSelect: (name: string) => void }) {
  return <button type="button"
                 onClick={() => props.onSelect(props.name)}
                 className={`${props.selected ? "bg-gray-300" : "bg-gray-100"} p-2`}
  >
    {props.name}
  </button>;
}
