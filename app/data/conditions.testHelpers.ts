import { LOCATIONS } from "~/data/constants";

export const conditions = (location: string) => ( {
  timeFromHome: (p) => {
    return p.from.includes(LOCATIONS.home)
      && !p.through
      && p.to === location;
  },
  timeWithWaltham: (p) => {
    return p.from.includes(LOCATIONS.home)
      && p.through === LOCATIONS.waltham
      && p.to === location;
  },
  timeFromWaltham: (p) => {
    return p.from.includes(LOCATIONS.waltham)
      && p.to === location;
  },
  timeForWalthamDetour: (p) => {
    return true;
  },
  milesFromBoston: (p) => {
    return p.from === LOCATIONS.boston && p.to === location;
  }
} satisfies Record<
  string,
  ({ to, from, through }: {
    from: string
    to: string
    through?: string
  }) => boolean
>);
