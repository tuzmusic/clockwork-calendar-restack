import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { "data-testid"?: string }) {
  return (
    <div className="grid place-items-center h-full" >
      <button type="submit" className="p-2 bg-gray-200 border-black border" data-testid={props["data-testid"] ?? "saveButton"}>
        {props.children}
      </button>
    </div>
  );
}

