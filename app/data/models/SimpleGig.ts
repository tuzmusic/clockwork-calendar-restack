export default abstract class SimpleGig {
  protected readonly id: string;

  protected constructor(
    protected readonly location: string,
    protected readonly startDateTime: string,
    protected readonly endDateTime: string
  ) {
    this.id = this.startDateTime.split("T")[0];
  }

  public getId() {
    return this.id;
  }

  public getLocation() {
    return this.location;
  }

  public getStartTime() {
    return this.startDateTime;
  }

  public getEndTime() {
    return this.endDateTime;
  }

  public serialize() {
    return {
      location: this.location,
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime,
      id: this.id
    }
  }
}
