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

const toArray = (head: LinkedNode | null): number[] => {
  const list: number[] = [];

  let current = head;
  while (current !== null) {
    list.push(current.value);
    current = current.next;
  }

  return list;
};
const fromArray = (list: number[]): LinkedNode | null => {
  let head: LinkedNode | null = null;
  let prev: LinkedNode | null = null;

  for (let i = 0; i < list.length; i++) {
    const node = new LinkedNode(list[i]!);
    if (prev !== null) {
      prev.next = node;
    }
    if (head === null) {
      head = node;
    }
    prev = node;
  }

  return head;
};

const mergeTwoLists = (
  listA: LinkedNode | null,
  listB: LinkedNode | null,
): LinkedNode | null => {
  const dummy = new LinkedNode(0);

  let a = listA;
  let b = listB;
  let current = dummy;

  while (a !== null && b !== null) {
    if (a.value <= b.value) {
      current.next = a;
      a = a.next;
    } else {
      current.next = b;
      b = b.next;
    }
    current = current.next;
  }

  current.next = a ?? b;

  return dummy.next;
};

function mergeKLists(list: Array<LinkedNode | null>): LinkedNode | null {
  let interval = 1;
  while (interval < list.length) {
    for (let i = 0; i + interval < list.length; i += interval * 2) {
      list[i] = mergeTwoLists(list[i]!, list[i + interval]!);
    }
    interval = interval * 2;
  }

  return list[0] ?? null;
}

test("ensure mergeKLists returns the right results", () => {
  [
    {
      list: [fromArray([1, 4, 5]), fromArray([1, 3, 4]), fromArray([2, 6])],
      expected: [1, 1, 2, 3, 4, 4, 5, 6],
    },
    {
      list: [],
      expected: [],
    },
    {
      list: [fromArray([])],
      expected: [],
    },
    {
      list: [fromArray([]), fromArray([1])],
      expected: [1],
    },
    {
      list: [fromArray([1]), fromArray([0])],
      expected: [0, 1],
    },
  ].forEach(({ list, expected }) => {
    assert.deepEqual(toArray(mergeKLists(list)), expected);
  });
});
