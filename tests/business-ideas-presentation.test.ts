import assert from "node:assert/strict";
import test from "node:test";
import { businessGoals } from "../src/data/business-goals";
import { ideaOptions } from "../src/data/site-content";

test("merged design uses the five canonical goals and prepared answers", () => {
  assert.equal(ideaOptions.length, 5);
  assert.deepEqual(ideaOptions.map(({ id }) => id), businessGoals.map(({ id }) => id));
  for (const goal of businessGoals) {
    const option = ideaOptions.find(({ id }) => id === goal.id)!;
    assert.equal(option.label, goal.label);
    assert.equal(option.intro, goal.introduction);
    assert.equal(Boolean(option.direct), goal.selection === "automatic");
    assert.deepEqual(option.answers.map(({ title, text }) => ({ title, description: text })),
      goal.ideas.map(({ title, description }) => ({ title, description })));
  }
});
