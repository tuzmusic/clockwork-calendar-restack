describe("Gig abstract class", () => {
  class GigImpl extends Gig {}

  describe("public data", () => {
    const gig = new GigImpl()
    it("has a location", () => {
      expect(gig.location).toEqual('somewhere')
    });
  });
});
