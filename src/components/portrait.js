// A transparent 2D portrait, divided into tiles that become particle destinations.
// The old portrait.json and all OBJ/MTL files are no longer loaded.
export const portraitImage = 'attachments/portrait-polygon.png';

export function samplePortrait(image, columns = 28) {
  const rows = Math.round(columns * image.naturalHeight / image.naturalWidth);
  const sample = document.createElement('canvas');
  sample.width = columns * 4;
  sample.height = rows * 4;
  const context = sample.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0, sample.width, sample.height);
  const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
  const tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      let red = 0, green = 0, blue = 0, alpha = 0;
      for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
        const index = ((row * 4 + y) * sample.width + column * 4 + x) * 4;
        const weight = pixels[index + 3] / 255;
        red += pixels[index] * weight;
        green += pixels[index + 1] * weight;
        blue += pixels[index + 2] * weight;
        alpha += weight;
      }
      if (alpha < .015) continue;
      const hex = channel => Math.round(channel / alpha).toString(16).padStart(2, '0');
      tiles.push({
        u: (column + .5) / columns,
        v: (row + .5) / rows,
        sx: column * image.naturalWidth / columns,
        sy: row * image.naturalHeight / rows,
        sw: image.naturalWidth / columns,
        sh: image.naturalHeight / rows,
        colour: '#' + hex(red) + hex(green) + hex(blue)
      });
    }
  }
  return { image, tiles, columns, rows, aspect: image.naturalWidth / image.naturalHeight };
}

export async function loadPortrait() {
  if (!document.querySelector('#portrait-layout-css')) {
    const link = document.createElement('link');
    link.id = 'portrait-layout-css';
    link.rel = 'stylesheet';
    link.href = new URL('./portrait.css', import.meta.url).href;
    document.head.append(link);
  }
  const image = new Image();
  image.src = portraitImage;
  await image.decode();
  return samplePortrait(image);
}

// A light affine tilt and translation suggest depth while keeping facial features intact.
export function portraitLayout(width, height, aspect, pointer, enabled, settings) {
  const mobile = width < settings.mobileBreakpoint;
  const heightFraction = mobile ? settings.mobileHeightFraction : settings.heightFraction;
  const widthFraction = mobile ? settings.mobileWidthFraction : .84;
  const portraitHeight = Math.min(height * heightFraction, settings.maxHeight, width * widthFraction / aspect);
  const x = enabled ? pointer.x : 0;
  const y = enabled ? pointer.y : 0;
  return {
    width: portraitHeight * aspect,
    height: portraitHeight,
    cx: width * .5 + x * settings.shiftX,
    cy: height * (mobile ? settings.mobileCentreY : settings.centreY) + y * settings.shiftY,
    a: 1 - Math.abs(x) * settings.foreshorten,
    b: -y * settings.shearY,
    c: x * settings.shearX,
    d: 1 - Math.abs(y) * settings.foreshorten
  };
}

export function tileTarget(tile, layout) {
  const x = (tile.u - .5) * layout.width;
  const y = (tile.v - .5) * layout.height;
  return {
    x: layout.cx + layout.a * x + layout.c * y,
    y: layout.cy + layout.b * x + layout.d * y
  };
}

export function drawPortraitTile(context, portrait, tile, layout, position, growth) {
  if (growth <= 0) return;
  const width = layout.width / portrait.columns * growth;
  const height = layout.height / portrait.rows * growth;
  context.save();
  context.translate(position.x, position.y);
  context.transform(layout.a, layout.b, layout.c, layout.d, 0, 0);
  context.drawImage(portrait.image, tile.sx, tile.sy, tile.sw, tile.sh,
    -width / 2, -height / 2, width, height);
  context.restore();
}

export function drawCompletePortrait(context, portrait, layout) {
  context.save();
  context.translate(layout.cx, layout.cy);
  context.transform(layout.a, layout.b, layout.c, layout.d, 0, 0);
  context.drawImage(portrait.image, -layout.width / 2, -layout.height / 2, layout.width, layout.height);
  context.restore();
}
