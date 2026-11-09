import { test } from "node:test";
import assert from "node:assert/strict";

class Queue {
  private queue: string[];
  private headIndx: number;

  constructor() {
    this.headIndx = 0;
    this.queue = [];
  }

  size(): number {
    return this.queue.length - this.headIndx;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  push(item: string): void {
    this.queue.push(item);
  }

  pop(): string | undefined {
    const headItem = this.queue[this.headIndx];
    this.headIndx = this.headIndx + 1;
    return headItem;
  }
}

function alienOrder(words: string[]): string {
  const EDGE_SEPARATOR = "->";
  const graph: Map<
    string,
    {
      currentEdge: string[];
      pointsToKey: string[];
    }
  > = new Map();
  const indegreeCounter: Map<string, number> = new Map();

  const addEdge = (edgeDesc: string, edge: string[]) => {
    // avoid duplicate edges
    if (indegreeCounter.get(edgeDesc) !== undefined) {
      return;
    }

    graph.set(edgeDesc, {
      currentEdge: edge,
      pointsToKey: [],
    });
    indegreeCounter.set(edgeDesc, 0);

    // finding t->f, w->e, r->t, e->r
    [...indegreeCounter.keys()].forEach((key) => {
      if (
        key !== edgeDesc &&
        key.startsWith(edgeDesc.split(EDGE_SEPARATOR)[1]!)
      ) {
        indegreeCounter.set(key, indegreeCounter.get(key)! + 1);
        graph.get(edgeDesc)!.pointsToKey.push(key);
      }
      if (
        key !== edgeDesc &&
        edgeDesc.startsWith(key.split(EDGE_SEPARATOR)[1]!)
      ) {
        indegreeCounter.set(edgeDesc, indegreeCounter.get(edgeDesc)! + 1);
        graph.get(key)!.pointsToKey.push(edgeDesc);
      }
    });
  };

  for (let i = 0; i < words.length - 1; i++) {
    const firstWord = words[i];
    const secondWord = words[i + 1];

    let charPos = 0;
    while (
      firstWord &&
      charPos < firstWord.length &&
      secondWord &&
      charPos < secondWord.length
    ) {
      if (firstWord.length < charPos || secondWord.length < charPos) {
        break;
      }
      if (firstWord![charPos] !== secondWord![charPos]) {
        const edge = [firstWord[charPos]!, secondWord[charPos]!];
        addEdge(edge.join(EDGE_SEPARATOR), edge);
        break;
      }
      charPos++;
    }
  }

  const queue = new Queue();
  const edges = [...indegreeCounter.keys()];

  for (let i = 0; i < edges.length; i++) {
    if (indegreeCounter.get(edges[i]!) === 0) {
      queue.push(edges[i]!);
      break;
    }
  }

  let results = "";
  while (!queue.isEmpty()) {
    const edge = queue.pop();
    if (!edge) break;
    results += graph.get(edge)!.currentEdge[0];
    const nextPoints = graph.get(edge)!.pointsToKey;
    nextPoints.forEach((points) => queue.push(points));
    // is last in sequence and last edge
    if (nextPoints.length === 0) {
      results += graph.get(edge)!.currentEdge[1];
    }
  }

  return results;
}

test("alien order is able to handle all scenarios", () => {
  assert.equal(
    alienOrder(["wrt", "wrf", "er", "ett", "rftt"]),
    "wertf",
    "correct alien order",
  );
  assert.equal(alienOrder(["abc", "ab"]), "", "works on an invalid list");
  assert.equal(alienOrder([]), "", "works on empty list");
});
