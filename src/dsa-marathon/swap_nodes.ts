import test from "node:test";
import assert from "node:assert";

class LinkedNode {
  value: number;
  next: LinkedNode | null;

  constructor(value: number, node: LinkedNode | null = null) {
    this.value = value;
    this.next = node;
  }
}

function toArray(head: LinkedNode | null): number[] {
  const list: number[] = [];

  let current = head;
  while (current !== null) {
    list.push(current.value);
    current = current.next;
  }
  return list;
}

function fromArray(list: number[]): LinkedNode | null {
  let head: LinkedNode | null = null;
  let previousNode: LinkedNode | null = null;

  for (let i = 0; i < list.length; i++) {
    const node = new LinkedNode(list[i]!);

    if (head === null) {
      head = node;
    }
    if (previousNode !== null) {
      previousNode.next = node;
    }
    previousNode = node;
  }

  return head;
}

function swapNodes(head: LinkedNode | null): LinkedNode | null {
  const dummy: LinkedNode = new LinkedNode(0, head);

  let previous = dummy;
  while (previous.next !== null && previous.next.next !== null) {
    const first: LinkedNode = previous.next;
    const second: LinkedNode = first.next!;

    previous.next = second;
    first.next = second.next;
    second.next = first;

    previous = first;
  }

  return dummy.next;
}

test("ensure swapNodes functions correctly", () => {
  [
    {
      list: [],
      expected: [],
    },
    {
      list: [1],
      expected: [1],
    },
    {
      list: [1, 2],
      expected: [2, 1],
    },
    {
      list: [1, 2, 3],
      expected: [2, 1, 3],
    },
    {
      list: [1, 2, 3, 4],
      expected: [2, 1, 4, 3],
    },
  ].forEach(({ list, expected }) => {
    assert.deepEqual(toArray(swapNodes(fromArray(list))), expected);
  });
});
