import { test } from "node:test";
import assert from "node:assert/strict";

function searchRotatedArray(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    // check mid before choosing half
    if (nums[mid] === target) return mid;

    // is left edge sorted
    if (nums[left]! <= nums[mid]!) {
      if (target >= nums[left]! && target < nums[mid]!) {
        if (target === nums[left]) return left;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // is right edge sorted
      if (nums[mid]! <= nums[right]!) {
        if (target >= nums[mid]! && target <= nums[right]!) {
          if (target === nums[mid]) return mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
    }
  }

  return -1;
}

test("returns the correct values", () => {
  assert.deepEqual(searchRotatedArray([4, 5, 6, 7, 0, 1, 2], 4), 0);
  assert.deepEqual(searchRotatedArray([4, 5, 6, 7, 0, 1, 2], 3), -1);
  assert.deepEqual(searchRotatedArray([1], 1), 0);
  assert.deepEqual(searchRotatedArray([1], 1), 0);
  assert.deepEqual(searchRotatedArray([1], 0), -1);
  assert.deepEqual(searchRotatedArray([3, 1], 1), 1);
  assert.deepEqual(searchRotatedArray([5, 1, 3], 3), 2);
});
