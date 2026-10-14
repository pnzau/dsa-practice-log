import { test } from "node:test";
import assert from "node:assert/strict";

type Point = {
  x: number;
  y: number;
};

type HeapItem<T> = {
  prop: T;
  distance: number;
};

class MaxHeap<T> {
  private heap: HeapItem<T>[];

  constructor() {
    this.heap = [];
  }

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  peek(): HeapItem<T> | undefined {
    return this.isEmpty() ? undefined : this.heap[0]!;
  }

  heapSnapshot(): T[] {
    return this.heap.map(({ prop }) => prop);
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndx(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndx(index: number): number {
    return 2 * index + 2;
  }

  private swap(currIndx: number, swapIndx: number): void {
    const temp = this.heap[currIndx]!;
    this.heap[currIndx] = this.heap[swapIndx]!;
    this.heap[swapIndx] = temp;
  }

  private siftUp(index: number): void {
    let currentIndx = index;
    let parentIndx = this.getParentIndex(currentIndx);

    while (
      currentIndx > 0 &&
      this.heap[currentIndx]!.distance > this.heap[parentIndx]!.distance
    ) {
      this.swap(currentIndx, parentIndx);
      currentIndx = parentIndx;
      parentIndx = this.getParentIndex(currentIndx);
    }
  }

  private siftDown(index: number): void {
    let currentIndx = index;
    const size = this.size();

    while (this.getLeftChildIndx(currentIndx) < size) {
      const leftChildIndx = this.getLeftChildIndx(currentIndx);
      const rightChildIndx = this.getRightChildIndx(currentIndx);
      let largestIndex = leftChildIndx;

      if (
        rightChildIndx < size &&
        this.heap[rightChildIndx]!.distance > this.heap[leftChildIndx]!.distance
      ) {
        largestIndex = rightChildIndx;
      }

      if (
        this.heap[currentIndx]!.distance >= this.heap[largestIndex]!.distance
      ) {
        break;
      }

      this.swap(currentIndx, largestIndex);
      currentIndx = largestIndex;
    }
  }

  insert(item: HeapItem<T>): void {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }

  extract(): HeapItem<T> | undefined {
    if (this.isEmpty()) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const maxValue = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.siftDown(0);
    return maxValue;
  }

  replace(item: HeapItem<T>): void {
    this.heap[0] = item;
    this.siftDown(0);
  }
}

function kClosest(points: Point[], k: number): Point[] {
  const calc_distance = (point: Point): number => {
    return point.x * point.x + point.y * point.y;
  };

  const maxHeap = new MaxHeap<Point>();
  for (let i = 0; i <= points.length - 1; i++) {
    const distance = calc_distance(points[i]!);

    if (maxHeap.size() < k) {
      maxHeap.insert({
        distance,
        prop: points[i]!,
      });
    } else {
      const peek = maxHeap.peek();
      if (peek && distance < peek.distance) {
        maxHeap.replace({
          distance,
          prop: points[i]!,
        });
      }
    }
  }

  return maxHeap.heapSnapshot();
}

const points = [
  { x: 1, y: 3 },
  { x: -2, y: 2 },
  { x: 5, y: 8 },
  { x: 0, y: 1 },
  { x: -1, y: -1 },
];

test("finds the closest points to origin 0,0", () => {
  const k = 3;
  const closestPoints = kClosest(points, k);

  assert.equal(closestPoints.length, k, "it has points that matches the limit");

  const expectedValue = [
    { x: -2, y: 2 },
    { x: 0, y: 1 },
    { x: -1, y: -1 },
  ].map((p) => ({
    ...p,
    hasMatched: false,
  }));
  closestPoints.forEach((point) => {
    const index = expectedValue.findIndex(
      (p) => !p.hasMatched && p.x === point.x && p.y === point.y,
    );

    if (index !== -1) {
      expectedValue[index]!.hasMatched = true;
    }
  });
  assert.deepStrictEqual(
    expectedValue.map(({ hasMatched }) => hasMatched),
    [true, true, true],
    "it has these points",
  );
});

test("handles outliers for the limit", () => {
  assert.deepStrictEqual(kClosest(points, 0), [], "it handles outlier 0");
  assert.deepStrictEqual(
    kClosest(points, -2),
    [],
    "it handles outlier negative -2",
  );
});
