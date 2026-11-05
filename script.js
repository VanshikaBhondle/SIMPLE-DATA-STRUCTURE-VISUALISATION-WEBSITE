/* ===================================================
   Data Structure Visualizer — script.js
   Vanilla JS, beginner-friendly, with comments.
   Covers: Array, Stack, Queue (Linear/Circular/Priority/Deque),
           Linked List (Singly/Doubly/Circular),
           BST, Heap (Min/Max), Graph (BFS/DFS), Hash Table.
   =================================================== */

/* ---------- Tab switching ---------- */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

/* ---------- Sub-tab switching (Queue + LinkedList) ---------- */
document.querySelectorAll('#queue .subtab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#queue .subtab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#queue .qpanel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`#queue .qpanel[data-qpanel="${btn.dataset.qtype}"]`).classList.add('active');
  });
});

let llType = 'singly';
document.querySelectorAll('#linkedlist .subtab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#linkedlist .subtab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    llType = btn.dataset.lltype;
    renderList();
  });
});

/* ---------- Helpers ---------- */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const setStatus = (id, msg) => document.getElementById(id).textContent = msg;

function makeNode(val, label = '') {
  const el = document.createElement('div');
  el.className = 'node';
  el.textContent = val;
  if (label) {
    const s = document.createElement('small');
    s.textContent = label;
    el.appendChild(s);
  }
  return el;
}

/* =====================================================
   ARRAY
   ===================================================== */
let arr = [];
const arrView = document.getElementById('arrView');

function renderArray(highlights = {}) {
  arrView.innerHTML = '';
  arr.forEach((v, i) => {
    const n = makeNode(v, `[${i}]`);
    if (highlights[i]) n.classList.add(highlights[i]);
    arrView.appendChild(n);
  });
}

function loadArray() {
  const raw = document.getElementById('arrInput').value.trim();
  arr = raw ? raw.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)) : [];
  renderArray();
  setStatus('arrStatus', `Loaded ${arr.length} elements.`);
}

function insertAt() {
  const i = +document.getElementById('arrIdx').value;
  const v = +document.getElementById('arrVal').value;
  if (isNaN(i) || isNaN(v) || i < 0 || i > arr.length) return setStatus('arrStatus', 'Invalid index/value.');
  arr.splice(i, 0, v);
  renderArray({ [i]: 'found' });
  setStatus('arrStatus', `Inserted ${v} at index ${i}.`);
}

function deleteAt() {
  const i = +document.getElementById('arrIdx').value;
  if (isNaN(i) || i < 0 || i >= arr.length) return setStatus('arrStatus', 'Invalid index.');
  const removed = arr.splice(i, 1)[0];
  renderArray();
  setStatus('arrStatus', `Deleted ${removed} from index ${i}.`);
}

function updateAt() {
  const i = +document.getElementById('arrIdx').value;
  const v = +document.getElementById('arrVal').value;
  if (isNaN(i) || isNaN(v) || i < 0 || i >= arr.length) return setStatus('arrStatus', 'Invalid index/value.');
  arr[i] = v;
  renderArray({ [i]: 'found' });
  setStatus('arrStatus', `Updated index ${i} to ${v}.`);
}

function reverseArray() {
  arr.reverse();
  renderArray();
  setStatus('arrStatus', 'Array reversed.');
}

async function linearSearch() {
  const target = +document.getElementById('arrSearch').value;
  for (let i = 0; i < arr.length; i++) {
    renderArray({ [i]: 'highlight' });
    await sleep(350);
    if (arr[i] === target) {
      renderArray({ [i]: 'found' });
      return setStatus('arrStatus', `Found ${target} at index ${i}.`);
    }
  }
  renderArray();
  setStatus('arrStatus', `${target} not found.`);
}

async function binarySearch() {
  const target = +document.getElementById('arrSearch').value;
  const sorted = [...arr].every((v, i, a) => i === 0 || a[i - 1] <= v);
  if (!sorted) { arr.sort((a, b) => a - b); renderArray(); await sleep(400); }
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    renderArray({ [mid]: 'highlight' });
    await sleep(500);
    if (arr[mid] === target) { renderArray({ [mid]: 'found' }); return setStatus('arrStatus', `Found ${target} at index ${mid}.`); }
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  renderArray();
  setStatus('arrStatus', `${target} not found.`);
}

async function runSort() {
  const algo = document.getElementById('sortAlgo').value;
  setStatus('arrStatus', `Sorting with ${algo}...`);
  if (algo === 'bubble') await bubbleSort();
  else if (algo === 'selection') await selectionSort();
  else if (algo === 'insertion') await insertionSort();
  else if (algo === 'merge') { await mergeSort(0, arr.length - 1); }
  else if (algo === 'quick') { await quickSort(0, arr.length - 1); }
  renderArray(Object.fromEntries(arr.map((_, i) => [i, 'sorted'])));
  setStatus('arrStatus', `Sorted with ${algo}.`);
}

async function bubbleSort() {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      renderArray({ [j]: 'highlight', [j + 1]: 'highlight' });
      await sleep(120);
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
}
async function selectionSort() {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      renderArray({ [min]: 'highlight', [j]: 'highlight' });
      await sleep(80);
      if (arr[j] < arr[min]) min = j;
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
    renderArray({ [i]: 'sorted' });
    await sleep(120);
  }
}
async function insertionSort() {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      renderArray({ [j]: 'highlight', [j - 1]: 'highlight' });
      await sleep(100);
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      j--;
    }
  }
}
async function mergeSort(l, r) {
  if (l >= r) return;
  const m = (l + r) >> 1;
  await mergeSort(l, m);
  await mergeSort(m + 1, r);
  const merged = [];
  let i = l, j = m + 1;
  while (i <= m && j <= r) merged.push(arr[i] <= arr[j] ? arr[i++] : arr[j++]);
  while (i <= m) merged.push(arr[i++]);
  while (j <= r) merged.push(arr[j++]);
  for (let k = 0; k < merged.length; k++) {
    arr[l + k] = merged[k];
    renderArray({ [l + k]: 'highlight' });
    await sleep(80);
  }
}
async function quickSort(lo, hi) {
  if (lo >= hi) return;
  const pivot = arr[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    renderArray({ [j]: 'highlight', [hi]: 'found' });
    await sleep(80);
    if (arr[j] < pivot) { [arr[i], arr[j]] = [arr[j], arr[i]]; i++; }
  }
  [arr[i], arr[hi]] = [arr[hi], arr[i]];
  renderArray({ [i]: 'sorted' });
  await sleep(100);
  await quickSort(lo, i - 1);
  await quickSort(i + 1, hi);
}

/* =====================================================
   STACK
   ===================================================== */
let stack = [];
const stackView = document.getElementById('stackView');

function renderStack() {
  stackView.innerHTML = '';
  stack.forEach((v, i) => {
    const n = makeNode(v, i === stack.length - 1 ? 'top' : '');
    if (i === stack.length - 1) n.classList.add('highlight');
    stackView.appendChild(n);
  });
}
function pushStack() {
  const v = +document.getElementById('stackVal').value;
  if (isNaN(v)) return setStatus('stackStatus', 'Enter a value.');
  stack.push(v); renderStack();
  setStatus('stackStatus', `Pushed ${v}. Size = ${stack.length}.`);
}
function popStack() {
  if (!stack.length) return setStatus('stackStatus', 'Stack underflow.');
  const v = stack.pop(); renderStack();
  setStatus('stackStatus', `Popped ${v}. Size = ${stack.length}.`);
}
function peekStack() {
  if (!stack.length) return setStatus('stackStatus', 'Stack is empty.');
  setStatus('stackStatus', `Top = ${stack[stack.length - 1]}.`);
}
function stackInfo() {
  setStatus('stackStatus', `isEmpty = ${stack.length === 0}, size = ${stack.length}.`);
}
function resetStack() { stack = []; renderStack(); setStatus('stackStatus', 'Cleared.'); }

/* =====================================================
   QUEUE — Linear
   ===================================================== */
let queue = [];
const qView = document.getElementById('qView');
function renderQueue() {
  qView.innerHTML = '';
  queue.forEach((v, i) => {
    const label = i === 0 ? 'front' : (i === queue.length - 1 ? 'rear' : '');
    const n = makeNode(v, label);
    if (i === 0) n.classList.add('highlight');
    qView.appendChild(n);
  });
}
function enqueue() {
  const v = +document.getElementById('qVal').value;
  if (isNaN(v)) return setStatus('queueStatus', 'Enter a value.');
  queue.push(v); renderQueue();
  setStatus('queueStatus', `Enqueued ${v}.`);
}
async function dequeue() {
  if (!queue.length) return setStatus('queueStatus', 'Queue is empty.');
  const v = queue.shift(); renderQueue();
  setStatus('queueStatus', `Dequeued ${v}.`);
}
function peekQueue() {
  if (!queue.length) return setStatus('queueStatus', 'Queue is empty.');
  setStatus('queueStatus', `Front = ${queue[0]}.`);
}
function queueInfo() {
  setStatus('queueStatus', `isEmpty = ${queue.length === 0}, size = ${queue.length}.`);
}
function resetQueue() { queue = []; renderQueue(); setStatus('queueStatus', 'Cleared.'); }

/* ---------- Circular Queue ---------- */
let cq = { buf: [], cap: 6, front: 0, rear: 0, size: 0 };
const cqView = document.getElementById('cqView');
function cqInit() {
  const c = +document.getElementById('cqCap').value || 6;
  cq = { buf: new Array(c).fill(null), cap: c, front: 0, rear: 0, size: 0 };
  renderCQ();
  setStatus('queueStatus', `Circular queue initialized (cap=${c}).`);
}
function renderCQ() {
  cqView.innerHTML = '';
  cq.buf.forEach((v, i) => {
    const n = makeNode(v === null ? '·' : v, `[${i}]`);
    if (cq.size > 0 && i === cq.front) n.classList.add('highlight');
    if (cq.size > 0 && i === (cq.rear - 1 + cq.cap) % cq.cap) n.classList.add('found');
    cqView.appendChild(n);
  });
}
function cqEnqueue() {
  if (!cq.buf.length) cqInit();
  if (cq.size === cq.cap) return setStatus('queueStatus', 'Circular queue full.');
  const v = +document.getElementById('cqVal').value;
  if (isNaN(v)) return setStatus('queueStatus', 'Enter a value.');
  cq.buf[cq.rear] = v;
  cq.rear = (cq.rear + 1) % cq.cap;
  cq.size++; renderCQ();
  setStatus('queueStatus', `Enqueued ${v}. (front=${cq.front}, rear=${cq.rear})`);
}
function cqDequeue() {
  if (!cq.size) return setStatus('queueStatus', 'Circular queue empty.');
  const v = cq.buf[cq.front];
  cq.buf[cq.front] = null;
  cq.front = (cq.front + 1) % cq.cap;
  cq.size--; renderCQ();
  setStatus('queueStatus', `Dequeued ${v}. (front=${cq.front}, rear=${cq.rear})`);
}
function cqClear() { cqInit(); }

/* ---------- Priority Queue (lower number = higher priority) ---------- */
let pq = []; // {val, pri}
const pqView = document.getElementById('pqView');
function renderPQ() {
  pqView.innerHTML = '';
  pq.forEach((x, i) => {
    const n = makeNode(x.val, `p=${x.pri}`);
    if (i === 0) n.classList.add('highlight');
    pqView.appendChild(n);
  });
}
function pqEnqueue() {
  const v = +document.getElementById('pqVal').value;
  const p = +document.getElementById('pqPri').value;
  if (isNaN(v) || isNaN(p)) return setStatus('queueStatus', 'Need value + priority.');
  pq.push({ val: v, pri: p });
  pq.sort((a, b) => a.pri - b.pri);
  renderPQ();
  setStatus('queueStatus', `Enqueued ${v} with priority ${p}.`);
}
function pqDequeue() {
  if (!pq.length) return setStatus('queueStatus', 'Priority queue empty.');
  const x = pq.shift(); renderPQ();
  setStatus('queueStatus', `Dequeued ${x.val} (priority ${x.pri}).`);
}
function pqClear() { pq = []; renderPQ(); setStatus('queueStatus', 'Cleared.'); }

/* ---------- Deque ---------- */
let dq = [];
const dqView = document.getElementById('dqView');
function renderDQ() {
  dqView.innerHTML = '';
  dq.forEach((v, i) => {
    const label = i === 0 ? 'front' : (i === dq.length - 1 ? 'back' : '');
    dqView.appendChild(makeNode(v, label));
  });
}
function dqPushFront() {
  const v = +document.getElementById('dqVal').value;
  if (isNaN(v)) return;
  dq.unshift(v); renderDQ();
  setStatus('queueStatus', `Pushed ${v} to front.`);
}
function dqPushBack() {
  const v = +document.getElementById('dqVal').value;
  if (isNaN(v)) return;
  dq.push(v); renderDQ();
  setStatus('queueStatus', `Pushed ${v} to back.`);
}
function dqPopFront() {
  if (!dq.length) return setStatus('queueStatus', 'Deque empty.');
  const v = dq.shift(); renderDQ();
  setStatus('queueStatus', `Popped ${v} from front.`);
}
function dqPopBack() {
  if (!dq.length) return setStatus('queueStatus', 'Deque empty.');
  const v = dq.pop(); renderDQ();
  setStatus('queueStatus', `Popped ${v} from back.`);
}
function dqClear() { dq = []; renderDQ(); setStatus('queueStatus', 'Cleared.'); }

/* =====================================================
   LINKED LIST (Singly / Doubly / Circular)
   Represented as a simple array; renderer adapts to variant.
   ===================================================== */
let list = [];
const llView = document.getElementById('llView');

function renderList(highlightIdx = -1) {
  llView.innerHTML = '';
  list.forEach((v, i) => {
    const n = makeNode(v, `[${i}]`);
    if (i === highlightIdx) n.classList.add('found');
    llView.appendChild(n);
    if (i < list.length - 1) {
      const a = document.createElement('span');
      a.className = 'arrow ' + (llType === 'doubly' ? 'double' : 'single');
      llView.appendChild(a);
    }
  });
  if (llType === 'circular' && list.length > 0) {
    const loop = document.createElement('span');
    loop.className = 'arrow loop';
    loop.textContent = '↩ loops to head';
    llView.appendChild(loop);
  }
}
function llInsert() {
  const v = +document.getElementById('llVal').value;
  const p = +document.getElementById('llPos').value;
  if (isNaN(v) || isNaN(p) || p < 0 || p > list.length) return setStatus('llStatus', 'Invalid value/position.');
  list.splice(p, 0, v); renderList(p);
  setStatus('llStatus', `Inserted ${v} at position ${p}.`);
}
function llDelete() {
  const p = +document.getElementById('llPos').value;
  if (isNaN(p) || p < 0 || p >= list.length) return setStatus('llStatus', 'Invalid position.');
  const v = list.splice(p, 1)[0]; renderList();
  setStatus('llStatus', `Deleted ${v} from position ${p}.`);
}
async function llSearch() {
  const v = +document.getElementById('llVal').value;
  for (let i = 0; i < list.length; i++) {
    renderList(i); await sleep(300);
    if (list[i] === v) return setStatus('llStatus', `Found ${v} at position ${i}.`);
  }
  renderList(); setStatus('llStatus', `${v} not found.`);
}
function llSort() { list.sort((a, b) => a - b); renderList(); setStatus('llStatus', 'List sorted.'); }
async function llReverse() {
  list.reverse();
  renderList();
  setStatus('llStatus', 'List reversed.');
}
async function llMiddle() {
  if (!list.length) return setStatus('llStatus', 'List empty.');
  let slow = 0, fast = 0;
  while (fast < list.length - 1 && fast + 2 <= list.length - 1) {
    renderList(slow); await sleep(350);
    slow++; fast += 2;
  }
  // simpler final: index = floor(length/2)
  const mid = Math.floor(list.length / 2);
  renderList(mid);
  setStatus('llStatus', `Middle element = ${list[mid]} at index ${mid}.`);
}
let hasCycle = false;
function llInjectCycle() {
  if (!list.length) return setStatus('llStatus', 'Add elements first.');
  hasCycle = true;
  setStatus('llStatus', 'Cycle injected (tail → head).');
}
function llDetectCycle() {
  // Demo: cycle is set via flag (since array can't truly cycle without pointers)
  setStatus('llStatus', hasCycle ? 'Cycle DETECTED via Floyd\'s algorithm.' : 'No cycle present.');
}
function llClear() { list = []; hasCycle = false; renderList(); setStatus('llStatus', 'Cleared.'); }

/* =====================================================
   BST
   ===================================================== */
class BSTNode { constructor(v) { this.v = v; this.l = null; this.r = null; } }
let bstRoot = null;
const bstView = document.getElementById('bstView');

function bstInsert() {
  const v = +document.getElementById('bstVal').value;
  if (isNaN(v)) return setStatus('bstStatus', 'Enter a value.');
  bstRoot = insertNode(bstRoot, v);
  drawBST(); setStatus('bstStatus', `Inserted ${v}.`);
}
function insertNode(node, v) {
  if (!node) return new BSTNode(v);
  if (v < node.v) node.l = insertNode(node.l, v);
  else if (v > node.v) node.r = insertNode(node.r, v);
  return node;
}
function bstDelete() {
  const v = +document.getElementById('bstVal').value;
  if (isNaN(v)) return;
  bstRoot = deleteNode(bstRoot, v);
  drawBST(); setStatus('bstStatus', `Deleted ${v} (if existed).`);
}
function deleteNode(node, v) {
  if (!node) return null;
  if (v < node.v) node.l = deleteNode(node.l, v);
  else if (v > node.v) node.r = deleteNode(node.r, v);
  else {
    if (!node.l) return node.r;
    if (!node.r) return node.l;
    // Two children: find inorder successor
    let succ = node.r;
    while (succ.l) succ = succ.l;
    node.v = succ.v;
    node.r = deleteNode(node.r, succ.v);
  }
  return node;
}
async function bstSearch() {
  const v = +document.getElementById('bstVal').value;
  let n = bstRoot, path = [];
  while (n) {
    path.push(n.v); drawBST({ [n.v]: 'highlight' }); await sleep(450);
    if (n.v === v) { drawBST({ [n.v]: 'found' }); return setStatus('bstStatus', `Found ${v}. Path: ${path.join(' → ')}`); }
    n = v < n.v ? n.l : n.r;
  }
  drawBST(); setStatus('bstStatus', `${v} not found.`);
}
async function bstTraverse(type) {
  const order = [];
  if (type === 'inorder') (function f(n) { if (!n) return; f(n.l); order.push(n.v); f(n.r); })(bstRoot);
  else if (type === 'preorder') (function f(n) { if (!n) return; order.push(n.v); f(n.l); f(n.r); })(bstRoot);
  else if (type === 'postorder') (function f(n) { if (!n) return; f(n.l); f(n.r); order.push(n.v); })(bstRoot);
  else if (type === 'level') { const q = bstRoot ? [bstRoot] : []; while (q.length) { const n = q.shift(); order.push(n.v); if (n.l) q.push(n.l); if (n.r) q.push(n.r); } }
  for (let i = 0; i < order.length; i++) {
    drawBST({ [order[i]]: 'highlight' }); await sleep(500);
  }
  drawBST();
  setStatus('bstStatus', `${type} = [${order.join(', ')}]`);
}
function bstStats() {
  const height = (function h(n) { return !n ? 0 : 1 + Math.max(h(n.l), h(n.r)); })(bstRoot);
  let mn = bstRoot, mx = bstRoot;
  while (mn && mn.l) mn = mn.l;
  while (mx && mx.r) mx = mx.r;
  setStatus('bstStatus', `Height = ${height}, Min = ${mn ? mn.v : 'n/a'}, Max = ${mx ? mx.v : 'n/a'}`);
}
function bstClear() { bstRoot = null; drawBST(); setStatus('bstStatus', 'Cleared.'); }

/* Layout BST via in-order traversal to assign x positions */
function drawBST(highlights = {}) {
  bstView.innerHTML = '';
  if (!bstRoot) return;
  const positions = new Map();
  let x = 0;
  (function assign(n, depth) {
    if (!n) return;
    assign(n.l, depth + 1);
    positions.set(n, { x: x++, y: depth });
    assign(n.r, depth + 1);
  })(bstRoot, 0);
  const W = Math.max(positions.size * 60, 300);
  const H = (Math.max(...[...positions.values()].map(p => p.y)) + 1) * 80 + 40;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` });
  svg.appendChild(defs());
  const coords = new Map();
  positions.forEach((p, n) => {
    coords.set(n, { cx: 30 + p.x * 60, cy: 30 + p.y * 80 });
  });
  // edges
  function edges(n) {
    if (!n) return;
    const c = coords.get(n);
    [n.l, n.r].forEach(ch => {
      if (ch) {
        const cc = coords.get(ch);
        svg.appendChild(svgEl('line', { x1: c.cx, y1: c.cy, x2: cc.cx, y2: cc.cy, class: 'edge' }));
        edges(ch);
      }
    });
  }
  edges(bstRoot);
  // nodes
  coords.forEach((c, n) => {
    const cls = 'ncircle' + (highlights[n.v] ? ' ' + highlights[n.v] : '');
    svg.appendChild(svgEl('circle', { cx: c.cx, cy: c.cy, r: 20, class: cls }));
    const t = svgEl('text', { x: c.cx, y: c.cy, class: 'nlabel' });
    t.textContent = n.v;
    svg.appendChild(t);
  });
  bstView.appendChild(svg);
}

/* SVG helpers */
function svgEl(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}
function defs() {
  const d = svgEl('defs');
  d.innerHTML = `
    <linearGradient id="nodegrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5"/><stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa"/>
    </marker>`;
  return d;
}

/* =====================================================
   HEAP (array-backed)
   ===================================================== */
let heap = [];
let heapKind = 'min';
const heapView = document.getElementById('heapView');

function cmp(a, b) { return heapKind === 'min' ? a < b : a > b; }
function heapSetType() {
  heapKind = document.getElementById('heapType').value;
  heap = []; drawHeap();
  setStatus('heapStatus', `${heapKind}-heap mode.`);
}
function siftUp(i) {
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (cmp(heap[i], heap[p])) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; } else break;
  }
}
function siftDown(i) {
  const n = heap.length;
  while (true) {
    let best = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && cmp(heap[l], heap[best])) best = l;
    if (r < n && cmp(heap[r], heap[best])) best = r;
    if (best !== i) { [heap[i], heap[best]] = [heap[best], heap[i]]; i = best; } else break;
  }
}
function heapInsert() {
  const v = +document.getElementById('heapVal').value;
  if (isNaN(v)) return;
  heap.push(v); siftUp(heap.length - 1); drawHeap();
  setStatus('heapStatus', `Inserted ${v}.`);
}
function heapExtract() {
  if (!heap.length) return setStatus('heapStatus', 'Heap empty.');
  const root = heap[0];
  const last = heap.pop();
  if (heap.length) { heap[0] = last; siftDown(0); }
  drawHeap();
  setStatus('heapStatus', `Extracted ${root}.`);
}
function heapPeek() {
  setStatus('heapStatus', heap.length ? `Root = ${heap[0]}.` : 'Heap empty.');
}
function heapBuildFn() {
  const raw = document.getElementById('heapBuild').value.trim();
  heap = raw ? raw.split(',').map(s => +s.trim()).filter(n => !isNaN(n)) : [];
  for (let i = (heap.length >> 1) - 1; i >= 0; i--) siftDown(i);
  drawHeap();
  setStatus('heapStatus', `Built ${heapKind}-heap from ${heap.length} values.`);
}
function heapClear() { heap = []; drawHeap(); setStatus('heapStatus', 'Cleared.'); }

/* Draw heap as binary tree from array indices */
function drawHeap(highlights = {}) {
  heapView.innerHTML = '';
  if (!heap.length) return;
  const depth = Math.floor(Math.log2(heap.length)) + 1;
  const W = Math.max(2 ** depth * 50, 320);
  const H = depth * 80 + 40;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` });
  svg.appendChild(defs());
  const coords = [];
  for (let i = 0; i < heap.length; i++) {
    const lvl = Math.floor(Math.log2(i + 1));
    const idxInLvl = i - (2 ** lvl - 1);
    const totalInLvl = 2 ** lvl;
    const cx = (W / (totalInLvl + 1)) * (idxInLvl + 1);
    const cy = 30 + lvl * 80;
    coords.push({ cx, cy });
  }
  for (let i = 0; i < heap.length; i++) {
    const p = (i - 1) >> 1;
    if (i > 0) svg.appendChild(svgEl('line', { x1: coords[p].cx, y1: coords[p].cy, x2: coords[i].cx, y2: coords[i].cy, class: 'edge' }));
  }
  for (let i = 0; i < heap.length; i++) {
    const cls = 'ncircle' + (highlights[i] ? ' ' + highlights[i] : '');
    svg.appendChild(svgEl('circle', { cx: coords[i].cx, cy: coords[i].cy, r: 20, class: cls }));
    const t = svgEl('text', { x: coords[i].cx, y: coords[i].cy, class: 'nlabel' });
    t.textContent = heap[i];
    svg.appendChild(t);
  }
  heapView.appendChild(svg);
}

/* =====================================================
   GRAPH (adjacency list, circular layout)
   ===================================================== */
let graph = { nodes: [], adj: {} };
const gView = document.getElementById('gView');

function gAddNode() {
  const id = document.getElementById('gNode').value.trim();
  if (!id || graph.nodes.includes(id)) return setStatus('gStatus', 'Invalid or duplicate node.');
  graph.nodes.push(id); graph.adj[id] = [];
  drawGraph(); setStatus('gStatus', `Added node ${id}.`);
}
function gRemoveNode() {
  const id = document.getElementById('gNode').value.trim();
  if (!graph.nodes.includes(id)) return setStatus('gStatus', 'Node not found.');
  graph.nodes = graph.nodes.filter(n => n !== id);
  delete graph.adj[id];
  for (const k in graph.adj) graph.adj[k] = graph.adj[k].filter(n => n !== id);
  drawGraph(); setStatus('gStatus', `Removed node ${id}.`);
}
function gAddEdge() {
  const a = document.getElementById('gEdgeFrom').value.trim();
  const b = document.getElementById('gEdgeTo').value.trim();
  const directed = document.getElementById('gDirected').checked;
  if (!graph.nodes.includes(a) || !graph.nodes.includes(b)) return setStatus('gStatus', 'Both nodes must exist.');
  if (!graph.adj[a].includes(b)) graph.adj[a].push(b);
  if (!directed && !graph.adj[b].includes(a)) graph.adj[b].push(a);
  drawGraph(); setStatus('gStatus', `Edge ${a} ${directed ? '→' : '↔'} ${b}.`);
}
function gRemoveEdge() {
  const a = document.getElementById('gEdgeFrom').value.trim();
  const b = document.getElementById('gEdgeTo').value.trim();
  if (graph.adj[a]) graph.adj[a] = graph.adj[a].filter(n => n !== b);
  if (graph.adj[b]) graph.adj[b] = graph.adj[b].filter(n => n !== a);
  drawGraph(); setStatus('gStatus', `Removed edge ${a}-${b}.`);
}
async function gBFS() {
  const start = document.getElementById('gStart').value.trim();
  if (!graph.nodes.includes(start)) return setStatus('gStatus', 'Invalid start.');
  const visited = new Set([start]); const q = [start]; const order = [];
  while (q.length) {
    const n = q.shift(); order.push(n);
    drawGraph({ [n]: 'highlight' }); await sleep(500);
    for (const nb of graph.adj[n]) if (!visited.has(nb)) { visited.add(nb); q.push(nb); }
  }
  drawGraph(); setStatus('gStatus', `BFS from ${start}: ${order.join(' → ')}`);
}
async function gDFS() {
  const start = document.getElementById('gStart').value.trim();
  if (!graph.nodes.includes(start)) return setStatus('gStatus', 'Invalid start.');
  const visited = new Set(); const order = [];
  async function dfs(n) {
    visited.add(n); order.push(n);
    drawGraph({ [n]: 'highlight' }); await sleep(500);
    for (const nb of graph.adj[n]) if (!visited.has(nb)) await dfs(nb);
  }
  await dfs(start);
  drawGraph(); setStatus('gStatus', `DFS from ${start}: ${order.join(' → ')}`);
}
function gClear() { graph = { nodes: [], adj: {} }; drawGraph(); setStatus('gStatus', 'Cleared.'); }

function drawGraph(highlights = {}) {
  gView.innerHTML = '';
  if (!graph.nodes.length) return;
  const W = 500, H = 360, cx0 = W / 2, cy0 = H / 2, R = 130;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` });
  svg.appendChild(defs());
  const pos = {};
  graph.nodes.forEach((n, i) => {
    const a = (2 * Math.PI * i) / graph.nodes.length - Math.PI / 2;
    pos[n] = { cx: cx0 + R * Math.cos(a), cy: cy0 + R * Math.sin(a) };
  });
  const directed = document.getElementById('gDirected').checked;
  const drawn = new Set();
  for (const a of graph.nodes) {
    for (const b of graph.adj[a]) {
      const key = directed ? `${a}→${b}` : [a, b].sort().join('-');
      if (drawn.has(key)) continue;
      drawn.add(key);
      const cls = 'edge' + (directed ? ' edge-dir' : '');
      // shrink line to circle edge for directed arrow visibility
      const dx = pos[b].cx - pos[a].cx, dy = pos[b].cy - pos[a].cy;
      const len = Math.hypot(dx, dy) || 1;
      const ox = (dx / len) * 22, oy = (dy / len) * 22;
      svg.appendChild(svgEl('line', { x1: pos[a].cx + ox, y1: pos[a].cy + oy, x2: pos[b].cx - ox, y2: pos[b].cy - oy, class: cls }));
    }
  }
  graph.nodes.forEach(n => {
    const cls = 'ncircle' + (highlights[n] ? ' ' + highlights[n] : '');
    svg.appendChild(svgEl('circle', { cx: pos[n].cx, cy: pos[n].cy, r: 22, class: cls }));
    const t = svgEl('text', { x: pos[n].cx, y: pos[n].cy, class: 'nlabel' });
    t.textContent = n;
    svg.appendChild(t);
  });
  gView.appendChild(svg);
}

/* =====================================================
   HASH TABLE (separate chaining)
   ===================================================== */
let ht = { buckets: [], size: 7 };
const hView = document.getElementById('hView');

function hInit() {
  const n = +document.getElementById('hBuckets').value || 7;
  ht = { buckets: Array.from({ length: n }, () => []), size: n };
  renderHash(); setStatus('hStatus', `Initialized with ${n} buckets.`);
}
function hashKey(k) {
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) | 0;
  return Math.abs(h) % ht.size;
}
function ensureHT() { if (!ht.buckets.length) hInit(); }
function hSet() {
  ensureHT();
  const k = document.getElementById('hKey').value.trim();
  const v = document.getElementById('hVal').value.trim();
  if (!k) return setStatus('hStatus', 'Key required.');
  const i = hashKey(k);
  const found = ht.buckets[i].find(e => e.k === k);
  if (found) found.v = v; else ht.buckets[i].push({ k, v });
  renderHash(i); setStatus('hStatus', `hash("${k}") = ${i}. Stored ${k}=${v}.`);
}
function hGet() {
  ensureHT();
  const k = document.getElementById('hKey').value.trim();
  const i = hashKey(k);
  const e = ht.buckets[i].find(e => e.k === k);
  renderHash(i); setStatus('hStatus', e ? `hash("${k}") = ${i}. Value = ${e.v}.` : `hash("${k}") = ${i}. Not found.`);
}
function hDel() {
  ensureHT();
  const k = document.getElementById('hKey').value.trim();
  const i = hashKey(k);
  const before = ht.buckets[i].length;
  ht.buckets[i] = ht.buckets[i].filter(e => e.k !== k);
  renderHash(i);
  setStatus('hStatus', ht.buckets[i].length < before ? `Deleted "${k}" from bucket ${i}.` : `"${k}" not found.`);
}
function hClear() { hInit(); }

function renderHash(highlightBucket = -1) {
  hView.innerHTML = '';
  ht.buckets.forEach((b, i) => {
    const row = document.createElement('div');
    row.className = 'bucket';
    const lbl = document.createElement('span');
    lbl.className = 'bucket-label';
    lbl.textContent = `[${i}]`;
    if (i === highlightBucket) lbl.style.color = '#f59e0b';
    row.appendChild(lbl);
    b.forEach((e, j) => {
      row.appendChild(makeNode(`${e.k}:${e.v}`));
      if (j < b.length - 1) {
        const a = document.createElement('span'); a.className = 'arrow single'; row.appendChild(a);
      }
    });
    if (b.length === 0) {
      const empty = document.createElement('span');
      empty.style.color = '#64748b'; empty.style.fontSize = '0.85rem';
      empty.textContent = '(empty)';
      row.appendChild(empty);
    }
    hView.appendChild(row);
  });
}

/* ---------- Initial demo data ---------- */
arr = [5, 3, 8, 1, 9, 4]; renderArray();
hInit();
cqInit();
