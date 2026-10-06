import assert from "node:assert/strict";
import test from "node:test";
import { areaTools, brandIn, buildSteps, ideaBrand } from "../src/components/business-ideas/presentation";

test("brandIn names the first platform a text mentions", () => {
  assert.equal(brandIn("Turn Google visitors into bookings"), "google");
  assert.equal(brandIn("Sync bookings to Google Calendar"), "google-calendar");
  assert.equal(brandIn("Instagram enquiries routed to WhatsApp"), "instagram");
  assert.equal(brandIn("Send a WhatsApp rebooking nudge"), "whatsapp");
  assert.equal(brandIn("Direct booking to Square"), "square");
  assert.equal(brandIn("A square hero image"), null);
  assert.equal(brandIn("Post-visit review request"), null);
});

test("buildSteps splits deliverables without cutting sentences", () => {
  assert.deepEqual(buildSteps("Focused landing page; optimised Google Business profile; direct booking to Square."), [
    "Focused landing page",
    "Optimised Google Business profile",
    "Direct booking to Square",
  ]);
  assert.deepEqual(buildSteps("A focused landing page, an optimised Google profile and direct booking to Square"), [
    "A focused landing page",
    "An optimised Google profile",
    "Direct booking to Square",
  ]);
  // Two-part phrases and long clauses stay whole.
  assert.deepEqual(buildSteps("A booking page that shows prices and availability."), [
    "A booking page that shows prices and availability",
  ]);
  assert.deepEqual(buildSteps("A focused first version."), ["A focused first version"]);
  assert.deepEqual(
    buildSteps("A simple dashboard, connected to your booking system so the team sees every job in one place"),
    ["A simple dashboard, connected to your booking system so the team sees every job in one place"],
  );
});

test("every idea gets an official mark: the platform it names, else its area's tool", () => {
  assert.equal(ideaBrand("Turn Google visitors into bookings", "conversion"), "google");
  assert.equal(ideaBrand("Bring customers back automatically", "retention"), "whatsapp");
  assert.equal(ideaBrand("Track where bookings come from with Google Analytics", "conversion"), "google-analytics");
  // One distinct tool per area, so three ideas never share a mark.
  assert.equal(new Set(Object.values(areaTools)).size, Object.keys(areaTools).length);
});
