import { test } from "node:test";
import assert from "node:assert/strict";

function maxSubArray(nums: number[]): number {
  let bestSum = nums[0]!;
  let currentSum = nums[0]!;

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i]!, currentSum + nums[i]!);
    bestSum = Math.max(bestSum, currentSum);
  }
  return bestSum;
}

test("returns the correct values", () => {
  assert.deepEqual(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
  assert.deepEqual(maxSubArray([1]), 1);
  assert.deepEqual(maxSubArray([-8, -3, -5]), -3);
  assert.deepEqual(maxSubArray([5, 4, -1, 7, 8]), 23);
});
