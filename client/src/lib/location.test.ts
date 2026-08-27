import { describe, expect, it } from "vitest";
import { clinicAddress, clinicCoordinates, directionsLink, uberLink } from "./location";

describe("clinic location links", () => {
  it("keeps the official clinic coordinates and address in navigation links", () => {
    expect(clinicCoordinates).toEqual({ lat: -23.547313, lng: -46.570779 });
    expect(clinicAddress).toContain("R. Emílio Mallet, 317");
    expect(directionsLink).toContain("google.com/maps/dir");
    expect(directionsLink).toContain(encodeURIComponent(clinicAddress));
    expect(uberLink).toContain("m.uber.com/ul/");
    expect(uberLink).toContain("dropoff[latitude]=-23.547313");
    expect(uberLink).toContain("dropoff[longitude]=-46.570779");
    expect(uberLink).toContain(encodeURIComponent("Dra. Monique Cascapera"));
  });
});
