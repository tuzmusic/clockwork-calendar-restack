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


const tabNames = ["Email", "Full", "Calendar"] satisfies Array<keyof typeof TABS>;

function EmailGigCell({ row }: { row: EventRowJson }) {
  return row.emailGig ? <EmailHtml gig={row.emailGig} /> : null;
}

function CalendarGigCell({ row }: { row: EventRowJson }) {
  return row.googleGig
    ? <CalendarGigUI row={row} hasUpdates={row.hasUpdates} />
    : <SaveGigButton row={row} />;
}

const TABS = {
  Email: EmailGigCell,
  Full: FullGigUI,
  Calendar: CalendarGigCell
} as const;

export function EventRowUI({ row }: { row: EventRowJson }) {
  const [selectedTab, setSelectedTab] = useState<keyof typeof TABS>("Full");
  const MainComponent = TABS[selectedTab];
  return <React.Fragment key={row.id}>
    <MobileWrapper className={"bg-amber-500 sm:bg-amber-200"}>
      <EmailGigCell row={row} />
    </MobileWrapper>

    <div>
      <RoundedWrapper className="relative">
        <div className="invisible">
          <FullGigUI row={row} />
        </div>
        <div className="w-full absolute top-0 left-0">
          <MainComponent row={row} />
        </div>
      </RoundedWrapper>

      <div className="w-fit overflow-hidden ml-4 border rounded-b border-black border-t-0 sm:hidden">
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
      <CalendarGigCell row={row} />
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
