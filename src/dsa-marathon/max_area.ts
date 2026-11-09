import { test } from "node:test";
import assert from "node:assert/strict";

function maxArea(height: number[]): number {
  let right = height.length - 1;
  let left = 0;
  let bestArea = 0;

  while (left < right) {
    const width = right - left;
    const currentArea = Math.min(height[left]!, height[right]!) * width;
    bestArea = Math.max(bestArea, currentArea);

    if (height[left]! < height[right]!) {
      left++;
      continue;
    }
    right--;
  }

  return bestArea;
}

test("returns the correct values", () => {
  assert.deepEqual(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
  assert.deepEqual(maxArea([1, 1]), 1);
  assert.deepEqual(maxArea([4, 3, 2, 1, 4]), 16);
  assert.deepEqual(maxArea([1, 2, 1]), 2);
});
