import { DistanceData } from "~/data/types";

export default class DistanceService {
  public async getDistanceInfo(_args: {
    from: string
    to: string
    through?: string
  }): Promise<DistanceData> {
  }
}
