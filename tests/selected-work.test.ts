import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { selectedWorkProjects, pendingWorkProjects } from "../src/data/selected-work";
import { getProjectIndex, getSwipeStep } from "../src/lib/work-navigation";

test("seven supplied projects have real assets and no fabricated case-study URLs", () => {
  assert.equal(selectedWorkProjects.length, 7);
  assert.equal(new Set(selectedWorkProjects.map(({ id }) => id)).size, 7);
  for (const project of selectedWorkProjects) {
    for (const src of [project.image?.src, project.isotipo, project.previewHref, project.wordmark?.src]) {
      if (src) assert.ok(existsSync(path.join(process.cwd(), "public", src)), src);
    }
    assert.ok(project.image?.src.endsWith("-glass.webp"));
    assert.ok(project.services.length);
    assert.ok(project.summary);
    assert.ok(statSync(path.join(process.cwd(), "public", project.image!.src)).size < 200_000);
    if (project.href) assert.equal(project.href, "https://moustachebarbersgc.com/");
    const originalIcon = path.join(process.cwd(), "assets/selected-work/brand-assets/isotipos", project.id + ".png");
    assert.ok(readFileSync(originalIcon).equals(readFileSync(path.join(process.cwd(), "public", project.isotipo!))));
  }
  assert.ok(existsSync("public/images/work/daylight-background.webp"));
});

test("the operations platform is preserved, not confused with StockIA", () => {
  assert.equal(pendingWorkProjects[0].id, "custom-operations-platform");
  assert.equal(pendingWorkProjects[0].location, "USA");
  assert.ok(!selectedWorkProjects.some(({ id }) => id === "custom-operations-platform"));
});

test("navigation wraps at both ends and handles arbitrary jumps", () => {
  assert.equal(getProjectIndex(0, 7), 0);
  assert.equal(getProjectIndex(7, 7), 0);
  assert.equal(getProjectIndex(-1, 7), 6);
  assert.equal(getProjectIndex(20, 7), 6);
  assert.equal(getProjectIndex(-15, 7), 6);
  assert.equal(getProjectIndex(1, 0), 0);
  assert.equal(getProjectIndex(Infinity, 7), 0);
  assert.equal(getProjectIndex(6, 1), 0);
});

test("swipe is horizontal, deliberate and never triggered by taps or vertical scrolling", () => {
  const start = { x: 200, y: 300 };
  assert.equal(getSwipeStep(start, { x: 100, y: 308 }), 1);
  assert.equal(getSwipeStep(start, { x: 290, y: 310 }), -1);
  assert.equal(getSwipeStep(start, { x: 201, y: 301 }), 0);
  assert.equal(getSwipeStep(start, { x: 180, y: 500 }), 0);
  assert.equal(getSwipeStep(start, { x: 120, y: 390 }), 0);
});
