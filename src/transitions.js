// All scroll timing, camera choreography and morph behaviour live here.
export const motion={heroEnd:.13, graphStart:.24, graphEnd:.83, portraitStart:.89, portraitEnd:.99, smoothing:.075, rotationSensitivity:.006, drift:.035, assemblyStagger:.18, facetStart:.72};
export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
export const lerp=(a,b,t)=>a+(b-a)*t;
export function timeline(progress,count){const g=clamp((progress-motion.graphStart)/(motion.graphEnd-motion.graphStart))*(count-1);return {scatter:smooth((progress-.07)/.07),graph:smooth((progress-motion.heroEnd)/(motion.graphStart-motion.heroEnd)),journey:g,burst:smooth((progress-motion.graphEnd)/(motion.portraitStart-motion.graphEnd)),portrait:smooth((progress-motion.portraitStart)/(motion.portraitEnd-motion.portraitStart))};}
export function cameraAt(journey,regions){const i=Math.floor(journey),t=smooth(journey-i),a=regions[i].position,b=regions[Math.min(i+1,regions.length-1)].position;return {x:lerp(a[0],b[0],t),y:lerp(a[1],b[1],t),z:lerp(a[2],b[2],t)};}

// A deterministic arrival time per mesh vertex. Particles sharing a destination
// arrive together; face corners and particles therefore have identical positions.
export function assemblyAt(progress,vertexIndex){const stagger=((vertexIndex*37)%101)/100*motion.assemblyStagger;return smooth((progress-stagger)/(1-motion.assemblyStagger));}
export function facetGrowth(arrival){return smooth((arrival-motion.facetStart)/(1-motion.facetStart));}

// 2D portrait choreography. All motion strengths and sizing controls live here.
export const portraitMotion = {
  heightFraction: .80,
  maxHeight: 1100,
  centreY: .52,
  shiftX: 9,
  shiftY: 6,
  shearX: .018,
  shearY: .012,
  foreshorten: .008,
  pointerSmoothing: .065,
  tileStart: .52,
  tileComplete: .98,
  mobileBreakpoint: 900,
  mobileHeightFraction: .64,
  mobileCentreY: .38,
  mobileWidthFraction: .90
};
