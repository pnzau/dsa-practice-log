import { test } from "node:test";
import assert from "node:assert/strict";

export type Clock = () => number;

export class Queue<T> {
  private queue: T[];
  private headIdx: number;
  private limit: number | null;
  private COMPACTION_THRESHOLD = 500;
  constructor(boundedLimit?: number) {
    this.queue = [];
    this.headIdx = 0;
    this.limit = null;

    if (boundedLimit && boundedLimit > 0) {
      this.limit = boundedLimit;
    }
  }

  size(): number {
    return this.queue.length - this.headIdx;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  isFull(): boolean {
    if (this.limit === null) return false;
    return this.size() >= this.limit;
  }

  peek(): T | undefined {
    return this.queue[this.headIdx];
  }

  getRear(): T | undefined {
    if (!this.isEmpty()) {
      return this.queue[this.queue.length - 1];
    }
  }

  enqueue(item: T) {
    if (!this.isFull()) {
      this.queue[this.queue.length] = item;
    }
  }

  dequeue() {
    if (this.headIdx < this.queue.length) {
      this.headIdx++;
    }
    this.dataCompaction();
  }

  private dataCompaction() {
    if (
      this.headIdx > this.COMPACTION_THRESHOLD &&
      this.headIdx >= this.queue.length / 2
    ) {
      this.queue = this.queue.slice(this.headIdx);
      this.headIdx = 0;
    }
  }
}

export class Heap<T> {
  private heap: {
    order: number;
    value: T;
  }[];

  constructor() {
    this.heap = [];
  }

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  private getValueByIndx(index: number): T {
    return this.heap[index]!.value;
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.getValueByIndx(0);
  }

  private getLeftChildIndx(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndx(index: number): number {
    return 2 * index + 2;
  }

  private getParentIdx(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private swap(index: number, swapIndx: number): void {
    const temp = this.heap[index]!;
    this.heap[index] = this.heap[swapIndx]!;
    this.heap[swapIndx] = temp;
  }

  insert(value: { order: number; value: T }): void {
    this.heap.push(value);
    this.siftUp(this.heap.length - 1);
  }

  private getOrderByIndx(index: number): number {
    return this.heap[index]!.order;
  }

  private siftUp(index: number): void {
    let currentIdx = index;
    let parentIdx = this.getParentIdx(index);

    while (
      currentIdx > 0 &&
      this.getOrderByIndx(currentIdx) < this.getOrderByIndx(parentIdx)
    ) {
      this.swap(currentIdx, parentIdx);
      currentIdx = parentIdx;
      parentIdx = this.getParentIdx(currentIdx);
    }
  }

  extract(): T | undefined {
    if (this.isEmpty()) return undefined;
    if (this.heap.length === 1) return this.heap.pop()!.value;

    const minValue = this.heap[0]!.value;
    this.heap[0] = this.heap.pop()!;
    this.siftDown(0);
    return minValue;
  }

  private siftDown(index: number): void {
    let currentIdx = index;
    const size = this.size();

    while (this.getLeftChildIndx(currentIdx) < size) {
      let leftChildIndx = this.getLeftChildIndx(currentIdx);
      let rightChildIndx = this.getRightChildIndx(currentIdx);
      let smallestIndx = leftChildIndx;

      if (
        rightChildIndx < size &&
        this.getOrderByIndx(rightChildIndx) < this.getOrderByIndx(leftChildIndx)
      ) {
        smallestIndx = rightChildIndx;
      }

      // if currentIndx order is smaller or equal to smallestIndx order then the tree is sorted
      if (
        this.getOrderByIndx(currentIdx) <= this.getOrderByIndx(smallestIndx)
      ) {
        break;
      }

      this.swap(currentIdx, smallestIndx);
      currentIdx = smallestIndx;
    }
  }
}

export class RateLimiter {
  private requests: Map<string, Queue<number>>;
  private inactiveAfterMs = 30_000;
  private requestsLog: Heap<{
    userId: string;
    timestamp: number;
  }>;

  constructor(
    private limit: number,
    private windowMs: number,
  ) {
    this.requests = new Map();
    this.requestsLog = new Heap();
  }

  private processRequestWindow(timestamp: number, queue: Queue<number>) {
    while (!queue.isEmpty()) {
      const oldest = queue.peek()!;
      if (timestamp - oldest < this.windowMs) break;
      queue.dequeue();
    }
  }

  cleanUpInactiveUsers(timestamp: number, userId?: string) {
    if (userId) {
      this.requestsLog.insert({
        order: timestamp,
        value: {
          userId,
          timestamp,
        },
      });
    }

    const isInactive = (loggedTimestamp: number): boolean => {
      // loggedTimestamp is "inactive" if it is less than or equal to timestamp from the request
      return loggedTimestamp + this.inactiveAfterMs <= timestamp;
    };

    let requestLogPeek = this.requestsLog.peek();
    while (
      !this.requestsLog.isEmpty() &&
      requestLogPeek &&
      isInactive(requestLogPeek.timestamp)
    ) {
      const requestLog = this.requestsLog.extract()!;
      const userRequests = this.requests.get(requestLog.userId);
      requestLogPeek = this.requestsLog.peek();

      if (!userRequests) continue;
      if (userRequests.isEmpty()) {
        this.requests.delete(requestLog.userId);
        continue;
      }

      const latestTimestamp = userRequests.getRear()!;

      if (isInactive(latestTimestamp)) {
        this.requests.delete(requestLog.userId);
      }
    }
  }

  allow(userId: string, timestamp: number): boolean {
    if (!this.requests.has(userId)) {
      const queue = new Queue<number>(this.limit);
      this.requests.set(userId, queue);
    }
    const userRequestQueue = this.requests.get(userId)!;

    this.processRequestWindow(timestamp, userRequestQueue);
    if (userRequestQueue.isFull()) {
      this.cleanUpInactiveUsers(timestamp);
      return false;
    }
    userRequestQueue.enqueue(timestamp);
    this.cleanUpInactiveUsers(timestamp, userId);
    return true;
  }

  count(userId: string): number {
    if (!this.requests.has(userId)) return 0;
    return this.requests.get(userId)?.size() ?? 0;
  }

  exists(userId: string): boolean {
    return this.requests.has(userId);
  }
}

test("allows requests until the limit is reached", () => {
  const rateLimiter = new RateLimiter(3, 10_000);

  assert.equal(
    rateLimiter.allow("alice", 1_000),
    true,
    "request at 1s should be allowed",
  );
  assert.equal(
    rateLimiter.allow("alice", 3_000),
    true,
    "request at 3s should be allowed",
  );
  assert.equal(
    rateLimiter.allow("alice", 5_000),
    true,
    "request at 5s should be allowed",
  );
  assert.equal(
    rateLimiter.allow("alice", 6_000),
    false,
    "request at 6s should be rejected",
  );
  assert.equal(
    rateLimiter.allow("alice", 9_000),
    false,
    "request at 1s should be rejected",
  );
  assert.equal(
    rateLimiter.allow("alice", 10_000),
    false,
    "request at 9s should be rejected",
  );
  assert.equal(
    rateLimiter.allow("alice", 11_001),
    true,
    "request at 10s should be allowed",
  );
});

test("removes users inactive for 30 seconds while retaining active users", () => {
  const rateLimiter = new RateLimiter(3, 10_000);

  rateLimiter.allow("alice", 1_000);
  assert.equal(
    rateLimiter.exists("alice"),
    true,
    "Alice should be tracked after her request at 1,000ms",
  );
  rateLimiter.allow("alice", 2_000);
  assert.equal(
    rateLimiter.exists("alice"),
    true,
    "Alice should remain tracked after her request at 2s",
  );

  rateLimiter.allow("sam", 28_000);
  assert.equal(
    rateLimiter.exists("sam"),
    true,
    "Sam should remain tracked after his request at 28s",
  );

  rateLimiter.allow("bob", 35_000);
  assert.equal(
    rateLimiter.exists("alice"),
    false,
    "Alice should be removed after being inactive for more than 30 seconds",
  );
  assert.equal(
    rateLimiter.exists("bob"),
    true,
    "Bob should be tracked after his request at 33s",
  );
  assert.equal(
    rateLimiter.exists("sam"),
    true,
    "Sam should remain tracked because his request is still recent",
  );
});

test("does not count a rejected request against the limit", () => {
  const rateLimiter = new RateLimiter(3, 10_000);

  rateLimiter.allow("alice", 1_000);
  assert.equal(
    rateLimiter.count("alice"),
    1,
    "request at 1s should be counted",
  );
  rateLimiter.allow("alice", 3_000);
  assert.equal(
    rateLimiter.count("alice"),
    2,
    "request at 3s should be counted",
  );
  rateLimiter.allow("alice", 5_000);
  assert.equal(
    rateLimiter.count("alice"),
    3,
    "request at 5s should be counted",
  );
  rateLimiter.allow("alice", 6_000);
  assert.equal(
    rateLimiter.count("alice"),
    3,
    "request at 6s should not be counted",
  );
  rateLimiter.allow("bob", 4_000);
  assert.equal(rateLimiter.count("bob"), 1, "request at 4s should be counted");
});
