import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/remix";
import { PropsWithChildren } from "react";

const SuperSimpleButton = ({ children }: PropsWithChildren<{}>) => (
  <div className="border-2 p-2 h-min">{children}</div>
);

export default function LoginPage() {
  return (
    <div
      className={
        "flex flex-col w-full py-10 h-full gap-2 " +
        "items-center justify-start sm:justify-center"
      }
    >
      <SignedIn>
        <div>
          <UserButton />
        </div>
        <SuperSimpleButton>
          <SignOutButton />
        </SuperSimpleButton>
        <a href={"select-calendar"}>Select Calendar</a>
      </SignedIn>

      <SignedOut>
        <SuperSimpleButton>
          <SignInButton />
        </SuperSimpleButton>
        <a className={"hover:underline"} href={"/events?useFixture=true"}>
          Go to events page with fixture
        </a>
      </SignedOut>
    </div>
  );
}
