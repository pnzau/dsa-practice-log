import test from "node:test";
import assert from "node:assert";

// nums has to be a sortedArray
function findFirstAndLast(nums: number[], target: number): number[] {
  const findBoundary = (findFirst: boolean) => {
    let left = 0;
    let right = nums.length - 1;
    let position = -1;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      if (nums[mid] === target) {
        position = mid;

        if (findFirst) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      } else if (nums[mid]! < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return position;
  };

  return [findBoundary(true), findBoundary(false)];
}

test("ensure find first and last is calculated correctly", () => {
  [
    {
      nums: [5, 7, 7, 8, 8, 10],
      target: 8,
      expectedResult: [3, 4],
    },
    {
      nums: [5, 7, 7, 8, 8, 10],
      target: 6,
      expectedResult: [-1, -1],
    },
    {
      nums: [],
      target: 1,
      expectedResult: [-1, -1],
    },
    {
      nums: [5, 7, 7, 8, 8, 10],
      target: 7,
      expectedResult: [1, 2],
    },
    {
      nums: [1, 1, 1],
      target: 1,
      expectedResult: [0, 2],
    },
  ].forEach(({ nums, target, expectedResult }) => {
    assert.deepEqual(findFirstAndLast(nums, target), expectedResult);
  });
});
