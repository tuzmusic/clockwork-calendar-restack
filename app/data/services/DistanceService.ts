import { DistanceData } from "~/data/models/types";

export default class DistanceService {
  public async getDistanceInfo(_args: {
    from: string
    to: string
    through?: string
  }): Promise<DistanceData> {
    throw new Error('getDistanceInfo not implemented')
  }
}
