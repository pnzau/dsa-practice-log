import assert from "node:assert/strict";
import { test } from "node:test";

class Stack {
  private stack: number[];

  constructor() {
    this.stack = [];
  }

  peek(): number | undefined {
    return this.stack[this.stack.length - 1];
  }

  push(item: number): void {
    this.stack.push(item);
  }

  pop(): number | undefined {
    return this.stack.pop();
  }

  size(): number {
    return this.stack.length;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }
}

function largestRectangleArea(_heights: number[]): number {
  const stack = new Stack();
  let largestRectangle = 0;

  for (let i = 0; i <= _heights.length; i++) {
    const currentHeight = _heights.length === i ? 0 : _heights[i]!;

    while (!stack.isEmpty() && _heights[stack.peek()!]! > currentHeight) {
      const poppedIndex = stack.pop()!;
      const height = _heights[poppedIndex]!;
      const width = stack.size() === 0 ? i : i - stack.peek()! - 1;
      const area = height * width;

      largestRectangle = Math.max(largestRectangle, area);
    }

    stack.push(i);
  }

  return largestRectangle;
}

test("finds the correct largest rectangle area", () => {
  const cases = [
    { heights: [2, 1, 5, 6, 2, 3], expectedArea: 10 },
    { heights: [2, 4], expectedArea: 4 },
    { heights: [3, 3, 3], expectedArea: 9 },
    { heights: [0, 0, 0], expectedArea: 0 },
    { heights: [5, 4, 3, 2, 1], expectedArea: 9 },
  ];

  for (const { heights, expectedArea } of cases) {
    assert.equal(largestRectangleArea(heights), expectedArea);
  }
});
