import { PropsWithChildren } from "react";

export function RoundedWrapper(props: PropsWithChildren) {
  return <div className="border-gray-300 border rounded-md h-full" {...props} />;
}
