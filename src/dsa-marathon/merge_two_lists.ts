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

function fromArray(nums: number[]): LinkedNode | null {
  let head: LinkedNode | null = null;
  let previous: LinkedNode | null = null;
  for (let i = 0; i < nums.length; i++) {
    const node = new LinkedNode(nums[i]!);

    if (head === null) {
      head = node;
    }
    if (previous !== null) {
      previous.next = node;
    }
    previous = node;
  }

  return head;
}

function toArray(head: LinkedNode | null): number[] {
  const nums: number[] = [];

  let current = head;
  while (current !== null) {
    nums.push(current.value);
    current = current.next;
  }

  return nums;
}

function mergeTwoLists(
  listA: LinkedNode | null,
  listB: LinkedNode | null,
): LinkedNode | null {
  const dummy = new LinkedNode(0);

  let a = listA;
  let b = listB;
  let current: LinkedNode = dummy;
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
}

test("ensure mergeTwoLists generates the correct merge results", () => {
  [
    {
      listA: [],
      listB: [],
      expected: [],
    },
    {
      listA: [1, 3, 5],
      listB: [],
      expected: [1, 3, 5],
    },
    {
      listA: [],
      listB: [2, 4, 6],
      expected: [2, 4, 6],
    },
    {
      listA: [1, 4, 5],
      listB: [1, 3, 4],
      expected: [1, 1, 3, 4, 4, 5],
    },
  ].forEach(({ listA, listB, expected }, i) => {
    assert.deepEqual(
      toArray(mergeTwoLists(fromArray(listA), fromArray(listB))),
      expected,
      `failed at test ${i + 1} for listA: [${listA}], listB: [${listB}]`,
    );
  });
});
