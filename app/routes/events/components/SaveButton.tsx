import { PropsWithChildren } from "react";

export function SaveButton(props: PropsWithChildren & { "data-testid"?: string }) {
  return (
    <div className="grid place-items-center h-full" data-testid={props["data-testid"] ?? "saveButton"}>
      <button type="button" className="p-2 bg-gray-200 border-black border">
        {props.children}
      </button>
    </div>
  );
}
