const fs = require("fs");
const path = require("path");
const filePath =
  process.platform === "linux"
    ? "/dev/stdin"
    : path.join(__dirname, "../input.txt");
const input = fs
  .readFileSync(filePath)
  .toString()
  .split("\n")
  .map((v) => v.trim());

const [N, M] = input[0].split(" ").map(Number);
const edges = input.slice(1, 1 + M).map((v) => v.split(" ").map(Number));

const graph = {};
edges.forEach((v) => {
  const [a, b, c] = v;

  graph[a] ? graph[a].push([b, c]) : (graph[a] = [[b, c]]);
  graph[b] ? graph[b].push([a, c]) : (graph[b] = [[a, c]]);
});

class Heap {
  constructor(compare) {
    this.heap = [];
    this.compare = compare;
  }

  size() {
    return this.heap.length;
  }

  push(value) {
    const heap = this.heap;
    heap.push(value);

    let idx = heap.length - 1;
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.compare(heap[parent], heap[idx]) <= 0) break;
      [heap[parent], heap[idx]] = [heap[idx], heap[parent]];
      idx = parent;
    }
  }

  pop() {
    const heap = this.heap;

    if (heap.length === 0) return undefined;
    if (heap.length === 1) return heap.pop();

    const top = heap[0];
    heap[0] = heap.pop();

    let idx = 0;
    while (1) {
      let best = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (left < heap.length && this.compare(heap[left], heap[best]) < 0)
        best = left;
      if (right < heap.length && this.compare(heap[right], heap[best]) < 0)
        best = right;

      if (idx === best) break;

      [heap[best], heap[idx]] = [heap[idx], heap[best]];
      idx = best;
    }

    return top;
  }
}

const pq = new Heap((a, b) => a[1] - b[1]);
pq.push([1, 0]);

const dist = Array.from({ length: N + 1 }).fill(Infinity);
dist[1] = 0;

const parent = Array.from({ length: N + 1 }).fill(undefined);
parent[1] = 1;

while (pq.size() > 0) {
  const [node, cost] = pq.pop();

  if (cost < dist[node]) continue;

  for (const [next, weight] of graph[node]) {
    const nextCost = cost + weight;

    if (nextCost < dist[next]) {
      dist[next] = nextCost;
      pq.push([next, nextCost]);

      parent[next] = node;
    }
  }
}

const answer = [];

edges.forEach((v) => {
  const [a, b, _] = v;

  if (parent[a] === b || parent[b] === a) {
    answer.push([a, b]);
  }
});

console.log(answer.length);
answer.forEach((v) => {
  console.log(v.join(" "));
});
