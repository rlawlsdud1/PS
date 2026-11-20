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

const [V, E] = input[0].split(" ").map(Number);
const K = Number(input[1]);
const edges = input.slice(2, 2 + E + 1).map((v) => v.split(" ").map(Number));

const graph = {};
edges.forEach((edge) => {
  const [u, v, w] = edge;

  graph[u] ? graph[u].push([v, w]) : (graph[u] = [[v, w]]);
});

const pq = new Heap((a, b) => a[1] - b[1]);
pq.push([K, 0]);

const dist = Array.from({ length: V + 1 }).fill(Infinity);
dist[K] = 0;

while (pq.size()) {
  const [node, weight] = pq.pop();

  if (weight > dist[node]) continue;

  for (const [next, cost] of graph[node] || []) {
    const nextCost = weight + cost;

    if (nextCost < dist[next]) {
      dist[next] = nextCost;
      pq.push([next, nextCost]);
    }
  }
}

const answer = dist.slice(1);
answer.forEach((v) => {
  if (v === Infinity) console.log("INF");
  else console.log(v);
});
