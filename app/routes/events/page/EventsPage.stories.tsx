import type { Meta, StoryObj } from "@storybook/react";

import { getFixture } from "~/routes/events/page/eventRows.fixture";

import { EventsPage } from "./EventsPage";

const meta = {
  title: "Events Page",
  component: EventsPage,
  argTypes: {
    ...EventsPage
  },
  args: {}
} satisfies Meta<typeof EventsPage>;

export default meta;

type Story = StoryObj<typeof meta>

const fixture = getFixture();
fixture[1].hasChanged = true
export const Default = {
  args: {
    eventRows: fixture
  }
} satisfies Story;
