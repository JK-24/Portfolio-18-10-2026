// Two endpoints only. Every role blends linearly across the full graph journey.
export const palette = {
  ink: {
    background: '#f4f1e9', text: '#282824', muted: '#6b675e',
    line: '#827e76', accent: '#ac4238', face: '#d8cfb8'
  },
  vibrant: {
    background: '#bbdced', text: '#182f4b', muted: '#4d5979',
    line: '#377b87', accent: '#a33373', face: '#efad88'
  },
  facets: ['#e7c78f','#a5c9bc','#a9bbd3','#c5afc8','#e4b2a8','#728e9e','#f1dec0'],
  graph: {
    edgeWidth: 1.05, edgeOpacity: .22, activeEdgeOpacity: .45,
    hoverEdgeOpacity: .82, nodeRadius: 1.9, itemRadius: 5,
    masterRadius: 7.5, nodeOpacity: .65,
    bridgeOpacity: .36, bridgeWidth: .75,
    masterOpacity: .85, masterWidth: 1.35
  }
};
export function mix(start, end, progress) {
  const t = Math.max(0, Math.min(1, progress));
  const channels = hex => hex.slice(1).match(/.{2}/g).map(value => parseInt(value, 16));
  const a = channels(start), b = channels(end);
  return '#' + a.map((value, i) => Math.round(value + (b[i] - value) * t).toString(16).padStart(2, '0')).join('');
}
export function themeAt(progress) {
  return Object.fromEntries(Object.keys(palette.ink).map(role =>
    [role, mix(palette.ink[role], palette.vibrant[role], progress)]));
}
