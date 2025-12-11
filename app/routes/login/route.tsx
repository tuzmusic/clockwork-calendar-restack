import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/remix";
import { LoaderFunction, redirect } from "@remix-run/node";

import { oauth2Client } from "~/auth/auth0.server";

export const action: LoaderFunction = async () => {
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.readonly",
  ];

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" "),
  });

  return redirect(authorizeUrl);
};

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
        <div className="border-2 p-2 h-min">
          <SignOutButton />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="border-2 p-2 h-min">
          <SignInButton />
        </div>
        <a className={"hover:underline"} href={"/events?useFixture=true"}>
          Go to events page with fixture
        </a>
      </SignedOut>
    </div>
  );
}
