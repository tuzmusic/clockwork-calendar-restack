import { ActionFunctionArgs } from "@remix-run/node";

import DistanceService from "~/data/services/DistanceService";

export const PATH = "/actions/get-distance-info";

export async function action(
  args: ActionFunctionArgs,
  distanceService?: DistanceService
) {
  console.log("BEFORE BEFORE BEFORE");
  await distanceService?.getDistanceInfo();
  console.log("AFTER AFTER AFTER");
}
