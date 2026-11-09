import { test } from "node:test";
import assert from "node:assert/strict";

function twoSum(nums: number[], target: number): number[] {
  const seen: Map<number, number> = new Map();

  for (let i = 0; i < nums.length; i++) {
    const candidate = target - nums[i]!;

    if (seen.has(candidate)) {
      return [seen.get(candidate)!, i];
    }

    seen.set(nums[i]!, i);
  }
  return [];
}

test("returns the correct values", () => {
  assert.deepEqual(twoSum([2, 7, 11, 15], 9), [0, 1]);
  assert.deepEqual(twoSum([2, 7, 11, 15], 16), []);
  assert.deepEqual(twoSum([3, 3], 6), [0, 1]);
  assert.deepEqual(twoSum([2, 7, 11, 15, -2, 0, -1], 14), [3, 6]);
});
