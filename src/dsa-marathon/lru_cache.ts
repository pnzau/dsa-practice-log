import test from "node:test";
import assert from "assert";

class LinkNode {
  key: number;
  value: number;
  prev: LinkNode | null;
  next: LinkNode | null;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

// function _print_debugger(head: LinkNode | null): void {
//   const values = [];

//   let current = head;
//   while (current) {
//     values.push(current.value);
//     current = current.next;
//   }

//   console.log(values.join(" -> ") + " -> null");
// }

class LRUCache {
  private capacity: number;
  private cache: Map<number, LinkNode>;
  private leastRecentlyUsed: LinkNode = new LinkNode(0, 0);
  private mostRecentlyUsed: LinkNode = new LinkNode(0, 0);
  private usedCapacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.usedCapacity = 0;
    this.cache = new Map();

    this.mostRecentlyUsed.next = this.leastRecentlyUsed;
    this.leastRecentlyUsed.prev = this.mostRecentlyUsed;
  }

  private insertNodeAfterHead(key: number, value: number): LinkNode {
    const node = new LinkNode(key, value);
    node.prev = this.mostRecentlyUsed;
    node.next = this.mostRecentlyUsed.next;
    this.mostRecentlyUsed.next!.prev = node;
    this.mostRecentlyUsed.next = node;
    this.usedCapacity++;
    return node;
  }

  private updateMostRecentlyUsed(node: LinkNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
    node.next = this.mostRecentlyUsed.next;
    node.prev = this.mostRecentlyUsed;
    this.mostRecentlyUsed.next!.prev = node;
    this.mostRecentlyUsed.next = node;
  }

  private freeUpCapacity(): void {
    if (this.usedCapacity <= this.capacity) return;
    if (this.leastRecentlyUsed.prev) {
      this.cache.delete(this.leastRecentlyUsed.prev.key);
      const nextLeastRecentlyUsedCandidate = this.leastRecentlyUsed.prev.prev!;
      this.leastRecentlyUsed.prev = nextLeastRecentlyUsedCandidate;
      nextLeastRecentlyUsedCandidate.next = this.leastRecentlyUsed;
      this.usedCapacity--;
    }
  }

  get(key: number): number {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      this.updateMostRecentlyUsed(node);
      return node.value;
    }
    return -1;
  }
  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.value = value;
      this.updateMostRecentlyUsed(node);
    } else {
      const node = this.insertNodeAfterHead(key, value);
      this.cache.set(key, node);
      this.freeUpCapacity();
    }
  }
}

test("ensure the LRUCache works correctly", () => {
  const cache = new LRUCache(2);

  cache.put(1, 10);
  cache.put(2, 20);
  assert.equal(cache.get(1), 10);

  cache.put(3, 30);
  assert.equal(cache.get(2), -1);
  assert.equal(cache.get(3), 30);

  cache.put(4, 40);
  assert.equal(cache.get(1), -1);
  assert.equal(cache.get(3), 30);
  assert.equal(cache.get(4), 40);

  cache.put(1, 10);
  cache.put(1, 15);
  assert.equal(cache.get(1), 15);
});
