import { palette, themeAt, mix } from '../palette.js';
import { profile, ui } from '../contents.js';
import { timeline, cameraAt, lerp, motion, clamp, smooth, assemblyAt, portraitMotion } from '../transitions.js';
import { createGraph, graphSettings } from './model.js';
import { loadPortrait, portraitLayout, tileTarget, drawPortraitTile, drawCompletePortrait } from '../components/portrait.js';
import { openDetail } from '../components/story.js';

export async function startRenderer(regions) {
  const canvas = document.querySelector('#world');
  const ctx = canvas.getContext('2d');
  const portrait = await loadPortrait();
  const count = Math.max(graphSettings.minNodes, Math.ceil(portrait.tiles.length / regions.length) * regions.length);
  const graph = createGraph(regions, count);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, w = innerWidth, h = innerHeight;
  let progress = 0, target = 0, yaw = 0, pitch = 0;
  let drag = null, hover = null, screen = [], hero = [], lastTheme = -1;
  const pointer = { x: 0, y: 0 }, pointerTarget = { x: 0, y: 0 };
  const motionButton = document.querySelector('#motion');
  const intro = document.querySelector('.intro');
  const chapterCopies = [...document.querySelectorAll('.chapter-copy')];
  const progressBar = document.querySelector('#progress');

  function updateButton() {
    document.documentElement.style.scrollBehavior = paused ? 'auto' : 'smooth';
    motionButton.textContent = paused ? ui.motion.resume : ui.motion.pause;
    motionButton.setAttribute('aria-pressed', String(paused));
  }
  updateButton();
  motionButton.onclick = () => { paused = !paused; updateButton(); };
  reduced.addEventListener('change', () => { paused = reduced.matches; updateButton(); });

  function resize() {
    w = innerWidth; h = innerHeight;
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const context = off.getContext('2d');
    const size = Math.min(190, Math.max(70, w * .125));
    context.font = `900 ${size}px Arial`; context.textBaseline = 'top';
    profile.headline.forEach((line, i) => context.fillText(line,
      w * (w < 700 ? .07 : .08), h * (w < 700 ? .24 : .22) + 54 + i * size * .85));
    const data = context.getImageData(0, 0, w, h).data;
    hero = [];
    for (let y = 0; y < h; y += 5) for (let x = 0; x < w; x += 5) {
      if (data[(y * w + x) * 4 + 3] > 150) hero.push([x, y]);
    }
    readScroll();
  }
  function readScroll() {
    target = clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - h));
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('scroll', readScroll, { passive: true });
  addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    pointerTarget.x = clamp(event.clientX / w * 2 - 1, -1, 1);
    pointerTarget.y = clamp(event.clientY / h * 2 - 1, -1, 1);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    pointerTarget.x = pointerTarget.y = 0;
    hover = null;
  });

  canvas.addEventListener('pointerdown', event => {
    if (progress < motion.heroEnd || progress >= motion.graphEnd) return;
    drag = { x: event.clientX, y: event.clientY, moved: false };
    if (event.pointerType === 'mouse') canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (drag && event.buttons) {
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) drag.moved = true;
      yaw += dx * motion.rotationSensitivity;
      pitch = clamp(pitch + dy * motion.rotationSensitivity, -.65, .65);
      drag.x = event.clientX; drag.y = event.clientY;
    }
    hover = null;
    let best = 24;
    for (const point of screen) {
      if (!point.interactive) continue;
      const distance = Math.hypot(point.x - event.clientX, point.y - event.clientY);
      if (distance < best) { hover = point; best = distance; }
    }
    canvas.style.cursor = hover ? 'pointer' : progress > motion.heroEnd && progress < motion.graphEnd ? 'grab' : 'default';
  });
  canvas.addEventListener('pointerup', () => {
    if (drag && !drag.moved && hover?.interactive) {
      const node = graph.nodes[hover.index], region = regions[node.group];
      if (node.master) {
        yaw = pitch = 0;
        document.getElementById(region.id).scrollIntoView({ behavior: paused ? 'instant' : 'smooth' });
      } else if (node.item !== null) openDetail(region, region.items[node.item]);
    }
    drag = null;
  });
  canvas.addEventListener('pointercancel', () => { drag = null; });

  function project(x, y, z, scale) {
    const a = x * Math.cos(yaw) + z * Math.sin(yaw);
    const b = -x * Math.sin(yaw) + z * Math.cos(yaw);
    const yy = y * Math.cos(pitch) - b * Math.sin(pitch);
    const zz = y * Math.sin(pitch) + b * Math.cos(pitch);
    const k = 850 / (1100 - zz);
    return { x: w * (w < 700 ? .5 : .70) + a * k * scale, y: h * .48 + yy * k * scale, k, z: zz };
  }

  function frame(time) {
    progress = paused ? target : lerp(progress, target, motion.smoothing);
    if (Math.abs(progress - target) < .00001) progress = target;
    const state = timeline(progress, regions.length);
    const camera = cameraAt(state.journey, regions);
    const theme = themeAt(clamp(state.journey / Math.max(1, regions.length - 1)));
    const active = Math.round(state.journey);
    const scale = Math.min(w / 1000, h / 720) * 1.35;
    pointer.x = lerp(pointer.x, paused ? 0 : pointerTarget.x, portraitMotion.pointerSmoothing);
    pointer.y = lerp(pointer.y, paused ? 0 : pointerTarget.y, portraitMotion.pointerSmoothing);
    const layout = portraitLayout(w, h, portrait.aspect, pointer, !paused, portraitMotion);
    ctx.clearRect(0, 0, w, h);
    if (Math.abs(lastTheme - progress) > .0001) {
      for (const [key, value] of Object.entries(theme)) document.documentElement.style.setProperty('--' + key, value);
      lastTheme = progress;
    }
    progressBar.style.width = progress * 100 + '%';
    intro.style.opacity = String(1 - clamp(progress / .13));
    chapterCopies.forEach((element, i) => {
      element.style.opacity = String(clamp(1 - Math.abs(state.journey - i) * 1.4) * state.graph * (1 - state.burst));
    });

    screen = graph.nodes.map((node, i) => {
      const drift = paused ? 0 : Math.sin(time * .0003 + node.phase) * motion.drift * 100;
      const burst = 1 + state.burst * 1.1;
      const point = project((node.x - camera.x * .7) * burst,
        (node.y - camera.y * .7 + drift) * burst, (node.z - camera.z * .5) * burst, scale);
      const tile = portrait.tiles[i % portrait.tiles.length];
      const arrival = assemblyAt(state.portrait, i % portrait.tiles.length);
      const destination = tileTarget(tile, layout);
      point.x = lerp(point.x, destination.x, arrival);
      point.y = lerp(point.y, destination.y, arrival);
      const letter = hero[Math.floor(i / graph.nodes.length * hero.length)] || [w / 2, h / 2];
      point.x = lerp(letter[0] + Math.sin(node.phase) * state.scatter * 70, point.x, state.graph);
      point.y = lerp(letter[1] + Math.cos(node.phase) * state.scatter * 70, point.y, state.graph);
      return Object.assign(point, { index: i, arrival, tile,
        growth: smooth((arrival - portraitMotion.tileStart) / (portraitMotion.tileComplete - portraitMotion.tileStart)),
        interactive: state.graph > .95 && state.burst < .2 && (node.master || node.item !== null) });
    });

    const graphAlpha = state.graph * (1 - state.burst);
    ctx.lineWidth = palette.graph.edgeWidth;
    for (const [a, b, type] of graph.edges) {
      const node = graph.nodes[a];
      const related = hover && graph.nodes[hover.index].group === node.group;
      const edgeStrength = type === 'bridge' ? palette.graph.bridgeOpacity : type === 'master' ? palette.graph.masterOpacity : 1;
      const depth = clamp((screen[a].k + screen[b].k) / 2, .45, 1.1);
      ctx.globalAlpha = graphAlpha * depth * (related ? palette.graph.hoverEdgeOpacity :
        (node.group === active ? palette.graph.activeEdgeOpacity : palette.graph.edgeOpacity) * edgeStrength);
      ctx.lineWidth = palette.graph.edgeWidth * (type === 'bridge' ? palette.graph.bridgeWidth : type === 'master' ? palette.graph.masterWidth : 1);
      ctx.strokeStyle = related ? theme.accent : theme.line;
      ctx.beginPath(); ctx.moveTo(screen[a].x, screen[a].y); ctx.lineTo(screen[b].x, screen[b].y); ctx.stroke();
    }

    // The image is built from moving texture tiles attached to the actual particles.
    // No separate portrait opacity animation or 3D mesh is used.
    ctx.globalAlpha = 1;
    if (state.portrait >= .9999) drawCompletePortrait(ctx, portrait, layout);
    else if (state.portrait > 0) {
      for (let i = 0; i < portrait.tiles.length; i++) {
        const point = screen[i];
        drawPortraitTile(ctx, portrait, point.tile, layout, point, point.growth);
      }
    }

    const particleAlpha = progress < .02 ? 0 : clamp(progress / .07);
    for (let i = 0; i < screen.length; i++) {
      const point = screen[i], node = graph.nodes[i];
      const selected = hover && (hover.index === i || graph.nodes[hover.index].group === node.group);
      ctx.globalAlpha = particleAlpha * (1 - point.growth) * (node.master ? 1 : selected ? .95 : palette.graph.nodeOpacity * clamp(point.k, .4, 1));
      ctx.fillStyle = selected || node.master
        ? mix(theme.accent, point.tile.colour, state.portrait)
        : mix(theme.text, point.tile.colour, state.portrait);
      ctx.beginPath();
      const radius = node.master ? palette.graph.masterRadius : node.item !== null ? palette.graph.itemRadius : palette.graph.nodeRadius;
      ctx.arc(point.x, point.y, radius * Math.max(.5, point.k), 0, Math.PI * 2); ctx.fill();
      if (node.master && graphAlpha > .5) {
        ctx.globalAlpha = graphAlpha * (node.group === active ? 1 : .55);
        ctx.font = '11px monospace'; ctx.fillStyle = theme.text;
        ctx.fillText(regions[node.group].label.toUpperCase(), point.x + 12, point.y - 10);
      }
    }
    if (hover && graphAlpha > .7) {
      const node = graph.nodes[hover.index];
      if (node.item !== null) {
        ctx.globalAlpha = 1; ctx.fillStyle = theme.text; ctx.font = '12px monospace';
        ctx.fillText(regions[node.group].items[node.item].title, hover.x + 14, hover.y - 12);
      }
    }
    if (progress > .005 && state.graph < 1) {
      ctx.globalAlpha = clamp(progress / .04) * (1 - state.graph); ctx.fillStyle = theme.text;
      for (let i = 0; i < hero.length; i += 2) {
        const letter = hero[i], point = screen[i % screen.length];
        ctx.fillRect(lerp(letter[0], point.x, state.graph), lerp(letter[1], point.y, state.graph), 1.6, 1.6);
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
