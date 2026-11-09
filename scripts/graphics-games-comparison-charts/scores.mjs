// 0-10 radar scores for the graphics and game libraries comparison. All ten axes are editorial scores read from
// data/radar-scores.csv (rubric in data/NOTES.md, each with its basis and source). Higher is always better.
import { toNumber } from '../language-charts/data-utils.mjs';

export const LIBRARIES = ['opengl', 'webgl', 'metal', 'vulkan', 'unity', 'unreal-engine'];
export const APIS = ['opengl', 'webgl', 'metal', 'vulkan'];
export const ENGINES = ['unity', 'unreal-engine'];
export const LIBRARY_NAMES = { opengl: 'OpenGL', webgl: 'WebGL', metal: 'Metal', vulkan: 'Vulkan', unity: 'Unity', 'unreal-engine': 'Unreal Engine' };
/** Palette slot of each library: the same colour, dash and marker in every figure. */
export const LIBRARY_SLOT = { opengl: 0, webgl: 1, metal: 2, vulkan: 3, unity: 4, 'unreal-engine': 5 };

export const AXES = [
  ['productivity', 'Productivity'],
  ['control', 'Control and performance ceiling'],
  ['platform_reach', 'Platform reach'],
  ['web_reach', 'Web reach'],
  ['learning_curve', 'Ease of learning'],
  ['tooling', 'Tooling and debugging'],
  ['documentation', 'Documentation'],
  ['ecosystem', 'Ecosystem and assets'],
  ['licensing', 'Licensing openness'],
  ['xr', 'XR support'],
];

/** Returns { library: { axisKey: score } } from the CSV data map; a missing score stays undefined (n/a). */
export function computeScores(data) {
  const out = {};
  for (const l of LIBRARIES) out[l] = {};
  for (const r of data['radar-scores']) {
    const v = toNumber(r.score);
    if (v !== null && out[r.platform]) out[r.platform][r.axis] = v;
  }
  return out;
}
