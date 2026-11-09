import test from "node:test";
import assert from "node:assert";

// nums has to be a sortedArray
function findFirstAndLast(nums: number[], target: number): number[] {
  const findPosition = (isPositionLast = false) => {
    let left = 0;
    let right = nums.length - 1;
    let position: number | undefined = undefined;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      const recordPosition = (index: number) => {
        position = isPositionLast
          ? position === undefined
            ? index
            : Math.max(position, index)
          : position === undefined
            ? index
            : Math.min(position, index);
      };

      const movePointers = (mid: number): void => {
        if (isPositionLast) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      };

      if (nums[mid] === target) {
        recordPosition(mid);
        movePointers(mid);
        continue;
      }

      // sort left side
      if (target >= nums[left]! && target < nums[mid]!) {
        if (target === nums[left]!) {
          recordPosition(left);

          if (isPositionLast) {
            left++;
            continue;
          }
        }
        right = mid - 1;
      } else {
        if (target === nums[right]!) {
          recordPosition(mid);

          if (!isPositionLast) {
            right--;
            continue;
          }
        }
        left = mid + 1;
      }
    }

    return position;
  };

  return [findPosition() ?? -1, findPosition(true) ?? -1];
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
  ].forEach(({ nums, target, expectedResult }) => {
    assert.deepEqual(findFirstAndLast(nums, target), expectedResult);
  });
});
