import test from "node:test";
import assert from "node:assert";

class ListNode {
  value: number;
  next: ListNode | null;

  constructor(value: number) {
    this.value = value;
    this.next = null;
  }

  setNext(next: ListNode | null) {
    this.next = next;
  }
}

function fromArray(values: number[]): ListNode | null {
  let previousNode: ListNode | null = null;
  let head: ListNode | null = null;
  for (let i = 0; i < values.length; i++) {
    const node = new ListNode(values[i]!);

    if (head === null) {
      head = node;
    }
    if (previousNode !== null) {
      previousNode.setNext(node);
    }
    previousNode = node;
  }

  return head;
}
function toArray(head: ListNode | null): number[] {
  const list: number[] = [];
  if (head === null) return list;

  list.push(head.value);
  let current = head;
  while (current.next) {
    list.push(current.next.value);
    current = current.next;
  }
  return list;
}

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(-1);
  dummy.setNext(head);

  let slow: ListNode | null = dummy;
  let fast: ListNode | null = dummy;

  for (let step = 0; step < n + 1; step++) {
    if (fast?.next) {
      fast = fast.next;
    } else {
      fast = null;
    }
  }

  while (fast !== null) {
    fast = fast.next;
    slow = slow.next!;
  }

  slow.next = slow.next!.next;
  return dummy.next;
}

test("ensure removeNthFromEnd works correctly", () => {
  [
    {
      values: [1, 2, 3, 4, 5],
      n: 2,
      expected: [1, 2, 3, 5],
    },
    {
      values: [1, 2],
      n: 2,
      expected: [2],
    },
    {
      values: [1],
      n: 1,
      expected: [],
    },
  ].forEach(({ values, n, expected }) => {
    assert.deepEqual(toArray(removeNthFromEnd(fromArray(values), n)), expected);
  });
});
