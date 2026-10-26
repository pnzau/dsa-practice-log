import { test } from "node:test";
import assert from "node:assert/strict";

function countDivisibleSubarrays(nums: number[], k: number): number {
  const normalizedMod = (value: number) => ((value % k) + k) % k;

  const remainderCount: Map<number, number> = new Map();
  let count = 0;
  let prefixSum = 0;
  remainderCount.set(0, 1);
  for (let i = 0; i < nums.length; i++) {
    prefixSum = prefixSum + nums[i]!;

    const mod = normalizedMod(prefixSum);
    const previousCount = remainderCount.get(mod) ?? 0;
    count += previousCount;
    remainderCount.set(mod, previousCount + 1);
  }

  return count;
}

test("finds the correct count of divisible sub arrays", () => {
  const cases = [
    { list: [4, 5, 0, -2, -3, 1], k: 5, expectedCount: 7 },
    { list: [5], k: 9, expectedCount: 0 },
    { list: [-5, 10], k: 5, expectedCount: 3 },
    { list: [0, 0, 0], k: 3, expectedCount: 6 },
    { list: [-1, 2, 9], k: 2, expectedCount: 2 },
  ];

  for (const { list, k, expectedCount } of cases) {
    const value = countDivisibleSubarrays(list, k);
    assert.equal(value, expectedCount);
  }
});
