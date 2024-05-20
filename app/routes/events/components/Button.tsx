import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { "data-testid"?: string }) {
  return (
    <div className="grid place-items-center h-full" data-testid={props["data-testid"] ?? "saveButton"}>
      <button type="submit" className="p-2 bg-gray-200 border-black border">
        {props.children}
      </button>
    </div>
  );
}

