// Geometry settings live here; visual weights remain in palette.js.
export const graphSettings = {
  minNodes: 1000,
  neighbours: 7,
  regionSpread: [410, 350, 490],
  podSpread: [145, 130, 155],
  bridgeEvery: 19
};

export function createGraph(regions, requestedCount = graphSettings.minNodes) {
  if (!regions.length) throw new Error('The graph needs at least one region.');
  const perRegion = Math.ceil(Math.max(graphSettings.minNodes, requestedCount) / regions.length);
  let seed = 29;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const nodes = [], masters = [];
  const pods = [[-.55,-.3,-.5],[.55,-.5,.25],[.3,.55,-.25],[-.35,.4,.5]];
  regions.forEach((region, group) => {
    masters.push(nodes.length);
    for (let i = 0; i < perRegion; i++) {
      const pod = pods[i % pods.length];
      const position = region.position.map((base, axis) =>
        base + pod[axis] * graphSettings.regionSpread[axis] +
        (random() + random() + random() - 1.5) * graphSettings.podSpread[axis]);
      const isItem = i > 0 && i <= region.items.length;
      if (!i) position.splice(0, 3, ...region.position);
      if (isItem) {
        const angle = (i - 1) / Math.max(1, region.items.length) * Math.PI * 2;
        position.splice(0, 3, region.position[0] + Math.cos(angle) * 88,
          region.position[1] + Math.sin(angle) * 82, region.position[2] + (i % 2 ? 40 : -40));
      }
      nodes.push({ x: position[0], y: position[1], z: position[2], group,
        size: !i ? 6 : 1 + random() * 2, phase: random() * Math.PI * 2,
        master: i === 0, item: isItem ? i - 1 : null });
    }
  });
  const distance = (a, b) => Math.hypot(a.x-b.x, a.y-b.y, a.z-b.z);
  const edges = [], edgeIndex = new Map();
  function addEdge(a, b, type = 'local') {
    if (a === b) return;
    const key = Math.min(a,b) + ':' + Math.max(a,b);
    if (edgeIndex.has(key)) {
      if (type === 'master') edges[edgeIndex.get(key)][2] = type;
      return;
    }
    edgeIndex.set(key, edges.length); edges.push([a, b, type]);
  }
  nodes.forEach((node, i) => {
    const start = node.group * perRegion;
    const neighbours = [];
    let previous = -1, previousDistance = Infinity;
    for (let j = start; j < start + perRegion; j++) {
      if (i === j) continue;
      const d = distance(node, nodes[j]); neighbours.push({ j, d });
      if (j < i && d < previousDistance) { previous = j; previousDistance = d; }
    }
    neighbours.sort((a,b) => a.d-b.d);
    for (const neighbour of neighbours.slice(0, graphSettings.neighbours)) addEdge(i, neighbour.j);
    // A local spanning tree prevents isolated clusters.
    if (previous >= 0) addEdge(i, previous);
    if (node.item !== null) addEdge(i, masters[node.group], 'master');
    if (!node.master && (i-start) % graphSettings.bridgeEvery === 0 && regions.length > 1) {
      const next = (node.group+1) % regions.length;
      let closest = masters[next], best = Infinity;
      for (let j = next*perRegion; j < (next+1)*perRegion; j++) {
        const d = distance(node,nodes[j]);
        if (d < best) { best = d; closest = j; }
      }
      addEdge(i,closest,'bridge');
    }
  });
  masters.forEach((master, group) => {
    const nearest = nodes.map((node,i) => ({i,d:distance(nodes[master],node)}))
      .filter(n => nodes[n.i].group === group && n.i !== master).sort((a,b) => a.d-b.d);
    for (const node of nearest.slice(0,16)) addEdge(master,node.i,'master');
    if (masters.length > 1) addEdge(master,masters[(group+1)%masters.length],'bridge');
  });
  return {nodes,edges};
}
