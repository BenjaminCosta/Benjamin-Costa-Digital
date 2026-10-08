import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { carouselTestimonials, testimonials, workana } from "../src/data/workana";
import { getReviewPosition } from "../src/lib/review-navigation";
import { socialProfiles } from "../src/data/social-profiles";

test("Workana uses 18 ratings, distinct from eight supplied written comments", () => {
  assert.equal(workana.ratingCount, 18);
  assert.equal(workana.score, "5.0");
  assert.equal(testimonials.length, 8);
  assert.equal(testimonials.filter((review) => review.featured).length, 3);
  assert.equal(testimonials.filter((review) => !review.featured).length, 5);
  assert.equal(new Set(testimonials.map((review) => review.id)).size, 8);
  assert.equal(new URL(workana.profileUrl).hash, "#section-ratings");
});
test("carousel mixes real website, automation and custom software reviews", () => {
  assert.equal(carouselTestimonials.length, 8);
  assert.equal(new Set(carouselTestimonials.map(({ id }) => id)).size, 8);
  assert.deepEqual(carouselTestimonials.slice(0, 3).map(({ author }) => author), ["Maria Rujano", "Fran", "Plantillaspromx"]);
  assert.ok(carouselTestimonials.some(({ tags }) => tags.includes("MySQL")));
  assert.ok(carouselTestimonials.some(({ tags }) => tags.includes("Zapier")));
  for (let index = 1; index < carouselTestimonials.length; index++) {
    assert.ok(!(carouselTestimonials[index].tags.includes("Shopify") && carouselTestimonials[index - 1].tags.includes("Shopify")));
  }
  assert.deepEqual(new Set(carouselTestimonials.map(({ id }) => id)), new Set(testimonials.map(({ id }) => id)));
});
test("carousel navigation clamps to complete views on mobile and desktop", () => {
  assert.equal(getReviewPosition(-1, 8, 1), 0);
  assert.equal(getReviewPosition(9, 8, 1), 7);
  assert.equal(getReviewPosition(9, 8, 2), 6);
  assert.equal(getReviewPosition(9, 8, 3), 5);
  assert.equal(getReviewPosition(0.98, 8, 3), 1);
  assert.equal(getReviewPosition(NaN, 8, 1), 0);
  assert.equal(getReviewPosition(2, 1, 3), 0);
});
test("translations retain their Spanish sources, full comments and correct names", () => {
  for (const review of testimonials) {
    assert.ok(review.quote.trim());
    assert.ok(review.originalQuote.trim());
    assert.equal(review.rating, 5);
    assert.equal(review.source, "Workana");
    assert.ok(review.tags.length);
    assert.ok(!("year" in review));
  }
  assert.equal(testimonials[1].author, "Maria Laura Rodrigues");
  assert.equal(testimonials[2].author, "Matias costadoni");
  assert.ok(testimonials[0].quote.includes("1000%"));
  assert.ok(testimonials[0].quote.includes("many more projects"));
  assert.ok(testimonials[3].quote.includes("fourth project"));
});
test("profile portrait and official vector logo are local, valid assets", () => {
  assert.ok(existsSync(`public${workana.portrait}`));
  const logo = readFileSync("public/images/workana/logo.svg", "utf8");
  assert.ok(logo.includes('viewBox="0 0 147 24"'));
  assert.ok(logo.includes('fill="#002D72"'));
  assert.ok(!/<script|<foreignObject|https?:\/\//i.test(logo.replace('xmlns="http://www.w3.org/2000/svg"', "")));
});
test("LinkedIn uses an official local mark and never a fabricated destination", () => {
  assert.ok(existsSync("public/images/brands/linkedin.png"));
  if (socialProfiles.linkedin) {
    const url = new URL(socialProfiles.linkedin);
    assert.equal(url.protocol, "https:");
    assert.ok(["linkedin.com", "www.linkedin.com"].includes(url.hostname));
    assert.ok(url.pathname.startsWith("/in/"));
  } else {
    assert.equal(socialProfiles.linkedin, null);
  }
});
