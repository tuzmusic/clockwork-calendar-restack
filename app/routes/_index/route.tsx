import { redirect } from "@remix-run/node";

export function loader() {
  return redirect('/login')
}

export default function IndexRoute() {
  return <h1>Hello index</h1>
}
