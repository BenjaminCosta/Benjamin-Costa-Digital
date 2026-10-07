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
    for (const src of [project.image?.src, project.isotipo, project.wordmark?.src]) {
      if (src) assert.ok(existsSync(path.join(process.cwd(), "public", src)), src);
    }
    assert.ok(project.image?.src.endsWith("-devices-v3.webp"));
    assert.ok(project.services.length);
    assert.ok(project.summary);
    assert.ok(statSync(path.join(process.cwd(), "public", project.image!.src)).size < 200_000);
    if (project.href) assert.equal(project.href, "https://moustachebarbersgc.com/");
    const originalIcon = path.join(process.cwd(), "assets/selected-work/brand-assets/isotipos", project.id + ".png");
    assert.ok(readFileSync(originalIcon).equals(readFileSync(path.join(process.cwd(), "public", project.isotipo!))));
  }
  assert.ok(existsSync("public/images/work/daylight-background.webp"));
});

test("project previews use the exact destinations supplied by Benjamin", () => {
  assert.deepEqual(selectedWorkProjects.map(({ id, previewHref }) => [id, previewHref]), [
    ["mr-moustache", "https://mr-moustache.vercel.app"],
    ["kirra-dive", "https://kirra-dive.vercel.app"],
    ["santos-becker", "https://santos-becker-actualsite.vercel.app"],
    ["agendify", "https://agendify.pro/"],
    ["stockia", "https://stockia-online.vercel.app/comercio"],
    ["decoratre", "https://decoratre-2.myshopify.com/"],
    ["a1-estudio", "https://a1-estudio.vercel.app/"],
  ]);
});

test("project media retain transparency so the shared background never changes", () => {
  for (const project of selectedWorkProjects) {
    const media = readFileSync(path.join(process.cwd(), "public", project.image!.src));
    assert.equal(media.toString("ascii", 0, 4), "RIFF");
    assert.equal(media.toString("ascii", 8, 12), "WEBP");
    assert.equal(media.toString("ascii", 12, 16), "VP8X");
    // The alpha flag must survive WebP export; no flattening onto an ivory plate.
    assert.ok(media[20] & 0x10, project.id + " must preserve its transparent background");
  }
});

test("supplied HQ wordmarks are used without adding icons to A1 or StockIA headings", () => {
  for (const project of selectedWorkProjects) {
    if (project.id === "a1-estudio" || project.id === "stockia") {
      assert.equal(project.wordmark, undefined);
      continue;
    }
    assert.equal(project.wordmark?.src, `/images/work/wordmarks/hq/${project.id}.webp`);
    const original = `assets/selected-work/brand-assets/logos-hq/${project.id}.png`;
    assert.ok(existsSync(original));
    assert.ok(statSync(path.join("public", project.wordmark!.src)).size < 200_000);
  }
  assert.ok(existsSync("assets/selected-work/brand-assets/logos-hq/a1-estudio.png"));
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
