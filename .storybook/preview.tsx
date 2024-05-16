import { createRemixStub } from "@remix-run/testing";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  decorators: [
    Story => {
      const Stub = createRemixStub([
        {
          path: '/',
          Component: () => <Story />,
        },
      ])

      return <Stub />
    },
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
