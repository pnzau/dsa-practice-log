import assert from "node:assert/strict";
import { test } from "node:test";

type Request = {
  timestamp: number;
  latency: number;
};

class MonotonicDecreasingDeque<T> {
  private queue: T[];
  private headIdx: number;

  constructor() {
    this.queue = [];
    this.headIdx = 0;
  }

  size(): number {
    return this.queue.length - this.headIdx;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  pushBack(item: T): void {
    this.queue.push(item);
  }

  popFront(): T | undefined {
    const value = this.queue[this.headIdx];

    if (this.headIdx < this.queue.length - 1) {
      this.headIdx++;
    } else {
      this.queue = [];
      this.headIdx = 0;
    }
    return value;
  }

  popBack(): T | undefined {
    return this.queue.pop();
  }

  peekFront(): T | undefined {
    return this.queue[this.headIdx];
  }

  peekBack(): T | undefined {
    return this.queue[this.queue.length - 1];
  }
}

function slidingWindowMaxLatency(
  requests: Request[],
  windowSize: number,
): number[] {
  const deque = new MonotonicDecreasingDeque<[number, number]>();
  const slidingWindow: number[] = [];

  requests.forEach((r) => {
    let queueFront = deque.peekFront();
    while (!deque.isEmpty() && queueFront![0] <= r.timestamp - windowSize) {
      deque.popFront();
      queueFront = deque.peekFront();
    }

    let queueBack = deque.peekBack();
    while (!deque.isEmpty() && r.latency >= queueBack![1]) {
      deque.popBack();
      queueBack = deque.peekBack();
    }

    deque.pushBack([r.timestamp, r.latency]);
    slidingWindow.push(deque.peekFront()![1]);
  });

  return slidingWindow;
}

test("produces the correct max latency", () => {
  const requests = [
    { timestamp: 1, latency: 120 },
    { timestamp: 3, latency: 80 },
    { timestamp: 4, latency: 150 },
    { timestamp: 8, latency: 90 },
    { timestamp: 10, latency: 200 },
    { timestamp: 11, latency: 170 },
    { timestamp: 14, latency: 160 },
  ];

  assert.deepStrictEqual(
    slidingWindowMaxLatency(requests, 10),
    [120, 120, 150, 150, 200, 200, 200],
  );
});
