import {mountStory} from './components/story.js';
import {startRenderer} from './graph/renderer.js';
import {regions} from './graph/regions/index.js';
mountStory();startRenderer(regions).catch(error=>{console.error(error);document.querySelector('#world').hidden=true;document.querySelectorAll('.chapter-copy').forEach(el=>el.style.opacity='1');});
