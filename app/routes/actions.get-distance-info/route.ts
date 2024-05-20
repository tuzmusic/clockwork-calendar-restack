import { ActionFunctionArgs } from "@remix-run/node";

import DistanceService from "~/data/services/DistanceService";

export const PATH = '/actions/get-distance-info'

export async function action(
  args: ActionFunctionArgs,
  distanceService?: DistanceService
) {
  await distanceService?.getDistanceInfo()
  return null
}
