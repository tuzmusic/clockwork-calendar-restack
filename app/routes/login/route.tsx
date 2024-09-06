import { LoaderFunction, redirect } from "@remix-run/node";

import { oauth2Client } from "~/auth/auth0.server";

export const action: LoaderFunction = async () => {
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.readonly"
  ];

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" ")
  });

  return redirect(authorizeUrl);
};

export default function LoginPage() {
  return (
    <form method="post"
                className="flex w-full justify-center items-center sm:items-start py-10 h-full">
      <button type="submit" className="border-2 p-2 h-min">Log In</button>
    </form>
  );
}
