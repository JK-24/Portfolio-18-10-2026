import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = path.resolve(import.meta.dirname, '..');
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
const files = walk(path.join(root, 'src')).filter(file => file.endsWith('.js'));
for (const file of files) {
  execFileSync(process.execPath, ['--check', file]);
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    if (match[1].startsWith('.')) assert(fs.existsSync(path.resolve(path.dirname(file), match[1])));
  }
}
const { regions } = await import('../src/graph/regions/index.js');
const { createGraph, graphSettings } = await import('../src/graph/model.js');
const { timeline, assemblyAt, portraitMotion } = await import('../src/transitions.js');
const { samplePortrait, portraitLayout, tileTarget, drawPortraitTile } = await import('../src/components/portrait.js');
assert.deepEqual(regions.map(r => r.id), ['education', 'internships', 'projects', 'achievements', 'drawings']);
const graph = createGraph(regions);
assert.equal(graph.nodes.length, graphSettings.minNodes);
for (const edge of graph.edges) assert(edge.slice(0,2).every(i => i >= 0 && i < graph.nodes.length));
assert.equal(timeline(0, 5).graph, 0); assert.equal(timeline(1, 5).portrait, 1);
for (let i = 0; i < 1000; i++) { assert.equal(assemblyAt(0, i), 0); assert.equal(assemblyAt(1, i), 1); }
// Test sampling with an opaque tile and transparent surroundings.
const pixels = new Uint8ClampedArray(8 * 8 * 4);
for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) pixels.set([64, 128, 192, 255], (y * 8 + x) * 4);
globalThis.document = { createElement() { return { getContext() { return { drawImage() {}, getImageData() { return { data: pixels }; } }; } }; } };
const portrait = samplePortrait({ naturalWidth: 100, naturalHeight: 100 }, 2);
delete globalThis.document;
assert.equal(portrait.tiles.length, 1); assert.equal(portrait.tiles[0].colour, '#4080c0');
assert.equal(portrait.tiles[0].sw, 50); assert.equal(portrait.tiles[0].sh, 50);
const layout = portraitLayout(1200, 800, 1, { x: 0, y: 0 }, false, portraitMotion);
assert.deepEqual(tileTarget({ u: .5, v: .5 }, layout), { x: 600, y: 800 * portraitMotion.centreY });
const disabled = portraitLayout(1200, 800, 1, { x: 1, y: 1 }, false, portraitMotion);
assert.deepEqual(disabled, layout);
let draws = 0;
const context = { save() {}, translate() {}, transform() {}, restore() {}, drawImage() { draws++; } };
drawPortraitTile(context, portrait, portrait.tiles[0], layout, { x: 0, y: 0 }, 0); assert.equal(draws, 0);
drawPortraitTile(context, portrait, portrait.tiles[0], layout, { x: 0, y: 0 }, 1); assert.equal(draws, 1);
console.log(`PASS: ${files.length} modules; imports, graph, sampling, colours, portrait centring, tile drawing, assembly endpoints and disabled parallax.`);

// Dense network remains connected, deterministic, and free of duplicate edges.
assert.deepEqual(graph, createGraph(regions));
const keys = new Set(graph.edges.map(([a,b]) => Math.min(a,b)+':'+Math.max(a,b)));
assert.equal(keys.size, graph.edges.length);
const adjacency = Array.from({length:graph.nodes.length},()=>[]);
for(const [a,b] of graph.edges){adjacency[a].push(b);adjacency[b].push(a);}
const visited = new Set([0]), queue=[0];
for(let i=0;i<queue.length;i++)for(const v of adjacency[queue[i]])if(!visited.has(v)){visited.add(v);queue.push(v);}
assert.equal(visited.size,graph.nodes.length);
assert(graph.edges.some(e=>e[2]==='bridge'));assert(graph.edges.some(e=>e[2]==='master'));
const {palette,themeAt}=await import('../src/palette.js');
assert.deepEqual(themeAt(0),palette.ink);assert.deepEqual(themeAt(1),palette.vibrant);
assert.equal(themeAt(.5).background,'#d8e7eb');
assert.equal(layout.height,640);
const phone=portraitLayout(390,844,.833,{x:0,y:0},true,portraitMotion);
assert(phone.width<=390*.91);assert(phone.cy+phone.height/2<844*.73);
console.log(`PASS: ${graph.nodes.length} connected nodes / ${graph.edges.length} unique edges; exact palette endpoints and midpoint; 80%-height desktop portrait; phone fit.`);

const {profile,sections,ui}=await import('../src/contents.js');
assert.equal(profile.name,'Jaikrishna Sekaran');
assert.equal(sections.internships.items.length,3);
assert.equal(sections.projects.items.length,10);
assert.equal(sections.drawings.items.length,0);
assert(ui.visibleItems>0);
assert(fs.existsSync(path.join(root,profile.resume)));
for(const region of regions){assert(region.items.every(item=>item.title&&item.body));}
console.log('PASS: central content imports, resume asset, 3 internships, 10 projects and empty artwork state.');
