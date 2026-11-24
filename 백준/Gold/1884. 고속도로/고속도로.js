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

const K = Number(input[0]);
const N = Number(input[1]);
const R = Number(input[2]);
const roads = input.slice(3, 3 + R + 1).map((v) => v.split(" ").map(Number));

const graph = {};
roads.forEach((v) => {
  const [a, b, l, t] = v;
  graph[a] ? graph[a].push([b, l, t]) : (graph[a] = [[b, l, t]]);
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
pq.push([1, 0, 0]);

const dist = Array.from({ length: N + 1 }, () =>
  Array.from({ length: K + 1 }).fill(Infinity),
);

dist[1][0] = 0;

// 서로 다른 두 도로가 서로 같은 시작 도시와 서로 같은 도착 도시를 가질 수 있음에 유의하라.
// a에서 b로 가는 도로가 여러 개 있을 수 있다
// 문제 안될거같은데

while (pq.size() > 0) {
  const [city, distance, used_cost] = pq.pop();

  if (distance > dist[city][used_cost]) continue;

  if (city === N) {
    console.log(distance);
    process.exit(0);
  }

  for (const next of graph[city] || []) {
    const [adjacantCity, length, toll] = next;
    const accumulated_distance = distance + length;

    if (used_cost + toll <= K) {
      if (accumulated_distance < dist[adjacantCity][used_cost + toll]) {
        dist[adjacantCity][used_cost + toll] = accumulated_distance;
        pq.push([adjacantCity, accumulated_distance, used_cost + toll]);
      }
    }
  }
}

console.log(-1);
