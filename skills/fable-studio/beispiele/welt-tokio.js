/* ==========================================================================
   SZENE — „Baue eine interaktive 3D-Cyberpunk-Straße in Tokio“
   ========================================================================== */
FS.setup({
  title: 'Neon-Regen · Tokio 2077',
  subtitle: 'Eine endlose Fahrt durch eine verregnete Cyberpunk-Straße.',
  hint: 'Ziehen: umsehen · Scrollen: Tempo · Tippen: Blitz',
  seed: 2077, fov: 62, background: '#04030a', fog: ['#0c0720', 0.0105],
  post: { bloom: 1.2, vignette: 0.5, aberration: 0.004, grain: 0.05, exposure: 1.05 }
});
const R = FS.rand, L = 160;                      // L = Länge eines Straßenblocks, die Welt wiederholt sich nahtlos
const NEON = ['#ff2bd6', '#00e5ff', '#ffd400', '#ff3b3b', '#8a5cff', '#39ff88'];
const WORDS = ['ラーメン', '居酒屋', 'カラオケ', 'ホテル', '薬局', '電気街', '寿司', '酒場', '麻雀', '喫茶店', '焼肉', '未来', '夢', '24時', 'BAR', 'ネオン'];

/* ---------- Licht ---------- */
const hemi = FS.add(new THREE.HemisphereLight(FS.col('#3a2a6a'), FS.col('#120818'), 1.1));
const dl1 = new THREE.DirectionalLight(FS.col('#ff3bd0'), 0.55); dl1.position.set(1, 0.35, 0.2); FS.add(dl1);
const dl2 = new THREE.DirectionalLight(FS.col('#19d8ff'), 0.55); dl2.position.set(-1, 0.35, -0.2); FS.add(dl2);
FS.sky('#020208', '#2a1040', '#05030a', { power: 0.45 });

/* ---------- Ein Straßenblock ---------- */
const block = new THREE.Group();
const box = new THREE.BoxGeometry(1, 1, 1), plane = new THREE.PlaneGeometry(1, 1);
const glowList = [];

// Gebäude: vordere Reihe an der Straße, dahinter die Skyline
const builds = [];
[-1, 1].forEach((s) => {
  for (let z = 0; z > -L;) { const w = R.range(9, 17); if (z - w < -L) { builds.push({ s, z: (z - L) / 2, w: z + L, d: R.range(12, 18), h: R.range(16, 48), front: true }); break; } builds.push({ s, z: z - w / 2, w: w - 0.4, d: R.range(12, 18), h: R.range(14, 52), front: true }); z -= w; }
  for (let i = 0; i < 9; i++) builds.push({ s, z: -R.range(0, L), w: R.range(14, 26), d: R.range(14, 26), h: R.range(60, 150), back: R.range(32, 70) });
});
block.add(FS.inst(box, new THREE.MeshLambertMaterial(), builds.length, (i, d, c) => {
  const b = builds[i]; d.position.set(b.s * (b.front ? 10 + b.d / 2 : b.back), b.h / 2, b.z); d.scale.set(b.d, b.h, b.w);
  c.copy(FS.col(R.pick(['#17152b', '#1b1830', '#121426', '#1d1a2e', '#0f1322'])));
}));

// Fenster
const wins = [];
builds.forEach((b) => {
  const x = b.s * (b.front ? 10 : b.back - b.d / 2) - b.s * 0.06, stepY = b.front ? 3.2 : 5.5, stepZ = b.front ? 2.6 : 4.2, p = b.front ? 0.42 : 0.2;
  const tone = R.pick(['#ffc98a', '#9fdcff', '#ffe9c4']);
  for (let y = b.front ? 5.5 : 12; y < b.h - 2; y += stepY) for (let z = -b.w / 2 + 1.6; z < b.w / 2 - 1.2; z += stepZ)
    if (R.chance(p)) wins.push({ x, y, z: b.z + z, s: b.s, col: R.chance(0.12) ? R.pick(NEON) : tone, k: R.range(0.25, 1.3), big: !b.front });
});
block.add(FS.inst(plane, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), wins.length, (i, d, c) => {
  const w = wins[i]; d.position.set(w.x, w.y, w.z); d.rotation.y = -w.s * Math.PI / 2; d.scale.set(w.big ? 2.4 : 1.25, w.big ? 1.6 : 1.05, 1); c.copy(FS.col(w.col, w.k));
}));

// Ladenfronten im Erdgeschoss: einzelne Scheiben mit Lücken, darüber eine Neonleiste. Die wichtigste Lichtquelle auf Augenhöhe
const fronts = builds.filter((b) => b.front), panes = [];
fronts.forEach((b) => {
  const col = R.pick(NEON), warm = R.pick(['#ffcf99', '#ffe2bd', '#bfe6ff']);
  panes.push({ x: b.s * 9.75, y: 4.25, z: b.z, sx: 0.7, sy: 0.14, sz: b.w * 0.84, col, k: 3.2 });
  for (let z = -b.w / 2 + 1.4; z < b.w / 2 - 1.4; z += 2.5) if (R.chance(0.8)) panes.push({ x: b.s * 9.95, y: 1.75, z: b.z + z, sx: 0.2, sy: R.chance(0.3) ? 1.5 : 2.5, sz: 2.1, col: R.chance(0.25) ? col : warm, k: R.range(0.9, 1.7) });
  glowList.push({ pos: [b.s * 9.0, 2.4, b.z], color: col, size: 15, k: 0.1 });
});
const paneTex = FS.canvasTex(128, 128, (g) => {   // Schaufenster: Lichtverlauf, Rahmen, ein paar Schatten von Regalen und Menschen
  const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.55, '#b9b9b9'); gr.addColorStop(1, '#5a5a5a'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  g.fillStyle = 'rgba(0,0,0,.55)'; for (let i = 0; i < 5; i++) g.fillRect(R.range(8, 100), R.range(60, 90), R.range(8, 22), 60);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 40, 128, 4); g.strokeStyle = '#000'; g.lineWidth = 10; g.strokeRect(0, 0, 128, 128);
});
block.add(FS.inst(box, new THREE.MeshBasicMaterial({ map: paneTex }), panes.length, (i, d, c) => { const p = panes[i]; d.position.set(p.x, p.y, p.z); d.scale.set(p.sx, p.sy, p.sz); c.copy(FS.col(p.col, p.k)); }));

// Neonschilder mit Schrift: ein Zeichenaufruf pro Textur, Vorder- und Rückseite
const signTex = WORDS.map((w, i) => { const col = NEON[i % NEON.length]; return { tex: FS.textTex(w, { vertical: true, size: 120, color: col, bg: '#06060b', border: col }), col }; });
const signs = signTex.map(() => []);
fronts.forEach((b) => {
  const n = R.int(1, 3);
  for (let k = 0; k < n; k++) { const t = R.int(0, signTex.length - 1), w = R.range(1.3, 2.1); signs[t].push({ x: b.s * (10 - 0.5 - w / 2), y: R.range(6.5, Math.min(b.h - 3, 24)), z: b.z + R.range(-b.w / 2 + 1, b.w / 2 - 1), w }); }
});
signs.forEach((list, t) => {
  if (!list.length) return;
  const asp = signTex[t].tex.userData.aspect;
  block.add(FS.inst(plane, new THREE.MeshBasicMaterial({ map: signTex[t].tex, color: FS.col('#ffffff', 2.6) }), list.length * 2, (i, d) => {
    const s = list[i >> 1]; d.position.set(s.x, s.y, s.z + ((i & 1) ? -0.04 : 0.04)); d.rotation.y = (i & 1) ? Math.PI : 0; d.scale.set(s.w, s.w / asp, 1);
  }));
  list.forEach((s) => glowList.push({ pos: [s.x, s.y, s.z], color: signTex[t].col, size: 13, k: 0.2 }));
});

// Holo-Werbetafeln (animierter Shader, mit eigenem Nebel)
const holoMat = new THREE.ShaderMaterial({
  uniforms: { time: { value: 0 }, c1: { value: FS.col('#ff2bd6') }, c2: { value: FS.col('#00e5ff') }, fogC: { value: FS.col('#0c0720') }, fogD: { value: 0.0105 } },
  vertexShader: 'varying vec2 vUv;varying float vD;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vD=-mv.z;gl_Position=projectionMatrix*mv;}',
  fragmentShader: 'uniform float time,fogD;uniform vec3 c1,c2,fogC;varying vec2 vUv;varying float vD;float h(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5);}' +
    'void main(){vec2 uv=vUv;vec2 g=floor(uv*vec2(14.,7.)+vec2(floor(time*1.5),0.));float blk=step(.5,h(g));float scan=.7+.3*sin(uv.y*260.+time*6.);' +
    'vec3 col=mix(c1,c2,clamp(uv.y+.3*sin(time*.8+uv.x*5.),0.,1.));float sweep=smoothstep(.0,.15,fract(uv.x*.5-time*.12))*smoothstep(.35,.15,fract(uv.x*.5-time*.12));' +
    'col*=(.18+blk*1.5+sweep*2.)*scan;float e=smoothstep(0.,.02,uv.x)*smoothstep(1.,.98,uv.x)*smoothstep(0.,.04,uv.y)*smoothstep(1.,.96,uv.y);' +
    'col*=e*2.4;float f=exp(-fogD*fogD*vD*vD);gl_FragColor=vec4(mix(fogC,col,f),1.);}',
  side: THREE.DoubleSide
});
[[-9.8, 22, -38, 13, 9], [9.8, 30, -92, 16, 11], [-9.8, 17, -131, 11, 8]].forEach((h) => {
  const m = new THREE.Mesh(plane, holoMat); m.position.set(h[0], h[1], h[2]); m.rotation.y = h[0] < 0 ? Math.PI / 2 : -Math.PI / 2; m.scale.set(h[3], h[4], 1); block.add(m);
  glowList.push({ pos: [h[0] * 0.8, h[1], h[2]], color: '#b060ff', size: 40, k: 0.12 });
});

// Laternen, Masten, Kabel
const poles = []; for (let z = -8; z > -L; z -= 20) [-1, 1].forEach((s) => poles.push({ s, z: z - (s > 0 ? 10 : 0) }));
block.add(FS.inst(box, new THREE.MeshLambertMaterial(), poles.length * 2, (i, d, c) => {
  const p = poles[i >> 1]; c.copy(FS.col('#0c0c14'));
  if (i & 1) { d.position.set(p.s * 6.4, 7.4, p.z); d.scale.set(1.6, 0.14, 0.14); } else { d.position.set(p.s * 7.2, 3.8, p.z); d.scale.set(0.18, 7.6, 0.18); }
}));
block.add(FS.inst(box, new THREE.MeshBasicMaterial(), poles.length, (i, d, c) => { const p = poles[i]; d.position.set(p.s * 5.7, 7.3, p.z); d.scale.set(0.7, 0.12, 0.3); c.copy(FS.col(p.s > 0 ? '#ffe2b0' : '#bfe9ff', 5)); }));
poles.forEach((p) => glowList.push({ pos: [p.s * 5.7, 7.1, p.z], color: p.s > 0 ? '#ffd9a0' : '#a8e4ff', size: 9, k: 0.3 }));
const cab = [];
for (let i = 0; i < 16; i++) {                    // durchhängende Kabel quer über die Straße
  const z = -R.range(0, L), y = R.range(9, 15), dz = R.range(-3, 3), sag = R.range(0.6, 1.8);
  for (let k = 0; k < 10; k++) { const a = k / 10, b = (k + 1) / 10; cab.push(lerpX(a), y - Math.sin(a * Math.PI) * sag, z + dz * a, lerpX(b), y - Math.sin(b * Math.PI) * sag, z + dz * b); }
}
function lerpX(a) { return -10 + 20 * a; }
const cabGeo = new THREE.BufferGeometry(); cabGeo.setAttribute('position', new THREE.Float32BufferAttribute(cab, 3));
block.add(new THREE.LineSegments(cabGeo, new THREE.LineBasicMaterial({ color: FS.col('#050508') })));

// Lampionketten und Neon-Tore
const lant = [];
[-22, -70, -118].forEach((z) => { for (let k = 0; k <= 12; k++) { const a = k / 12; lant.push([-9 + 18 * a, 8.2 - Math.sin(a * Math.PI) * 1.5, z]); } });
block.add(FS.inst(new THREE.SphereGeometry(0.34, 10, 8), new THREE.MeshBasicMaterial(), lant.length, (i, d, c) => { d.position.set(lant[i][0], lant[i][1], lant[i][2]); d.scale.y = 1.25; c.copy(FS.col('#ff5a2a', 2.6)); }));
lant.forEach((p) => glowList.push({ pos: p, color: '#ff5a2a', size: 5, k: 0.35 }));
const gate = [];
[-50, -146].forEach((z, n) => { const col = n ? '#00e5ff' : '#ff2bd6'; gate.push([0, 11.5, z, 21, 0.22, 0.22, col], [0, 10.4, z, 18, 0.14, 0.14, col], [-8.6, 5.75, z, 0.22, 11.5, 0.22, col], [8.6, 5.75, z, 0.22, 11.5, 0.22, col]); glowList.push({ pos: [0, 11, z], color: col, size: 30, k: 0.12 }); });
block.add(FS.inst(box, new THREE.MeshBasicMaterial(), gate.length, (i, d, c) => { const g = gate[i]; d.position.set(g[0], g[1], g[2]); d.scale.set(g[3], g[4], g[5]); c.copy(FS.col(g[6], 3.4)); }));

// Dachlichter
builds.forEach((b) => { if (b.h > 40) glowList.push({ pos: [b.s * (b.front ? 10 + b.d / 2 : b.back), b.h + 1.5, b.z], color: '#ff2a2a', size: 5, k: 1.2 }); });
block.add(FS.glows(glowList));

// Block dreimal hintereinander, jeweils mit Spiegelbild für die nasse Straße
for (let k = -1; k <= 1; k++) {
  const g = k === 0 ? block : block.clone(true); g.position.z = -k * L; FS.add(g);
  FS.add(FS.mirror(g, 0));
}

/* ---------- Boden ---------- */
const wet = FS.canvasTex(256, 256, (g) => {      // helle Stellen = matter Asphalt, dunkle = Pfütze (spiegelt stärker)
  g.fillStyle = '#f4f4f4'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 46; i++) { const x = R.range(0, 256), y = R.range(0, 256), r = R.range(14, 46); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(120,120,120,.95)'); gr.addColorStop(1, 'rgba(120,120,120,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  for (let i = 0; i < 2600; i++) { g.fillStyle = 'rgba(' + (R.chance(0.5) ? '255,255,255' : '0,0,0') + ',.07)'; g.fillRect(R.range(0, 256), R.range(0, 256), 2, 2); }
});
wet.wrapS = wet.wrapT = THREE.RepeatWrapping; wet.repeat.set(6, 3 * L / 20); wet.encoding = THREE.LinearEncoding;
const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 3 * L), new THREE.MeshBasicMaterial({ color: FS.col('#07070d'), alphaMap: wet, transparent: true, opacity: 0.955, depthWrite: false }));
ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0, -L / 2); ground.renderOrder = -5; FS.add(ground);
const marks = [];
for (let z = L; z > -2 * L; z -= 8) marks.push([0, z, 0.22, 3.4]);
[-60, -140, 20, 100, -220, -300].forEach((z) => { for (let x = -5.2; x <= 5.2; x += 1.3) marks.push([x, z, 0.62, 4]); });
const markMesh = FS.inst(plane, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55, depthWrite: false }), marks.length, (i, d, c) => { const m = marks[i]; d.position.set(m[0], 0.02, m[1]); d.rotation.x = -Math.PI / 2; d.scale.set(m[2], m[3], 1); c.copy(FS.col('#cfd6ff', 0.55)); });
markMesh.renderOrder = -4; FS.add(markMesh);
const curb = FS.inst(box, new THREE.MeshBasicMaterial(), 2, (i, d, c) => { d.position.set(i ? 6.2 : -6.2, 0.07, -L / 2); d.scale.set(0.3, 0.14, 3 * L); c.copy(FS.col('#121120')); });
FS.add(curb);

/* ---------- Bewegte Dinge (laufen relativ zur Kamera und wickeln sich um) ---------- */
const dyn = new THREE.Group(), dynMirror = new THREE.Group(); dynMirror.scale.y = -1; FS.add(dyn); FS.add(dynMirror);
const SPAN = 300, wrapRel = (v) => ((v + SPAN / 2) % SPAN + SPAN) % SPAN - SPAN / 2;
const share = (mesh) => { const m = new THREE.InstancedMesh(mesh.geometry, mesh.material, mesh.count); m.instanceMatrix = mesh.instanceMatrix; m.instanceColor = mesh.instanceColor; m.frustumCulled = false; dynMirror.add(m); dyn.add(mesh); return mesh; };
const dummy = new THREE.Object3D();

// Autos: dunkler Körper, Scheinwerfer vorn, Rücklichter hinten
const cars = []; for (let i = 0; i < 12; i++) { const dir = i % 2 ? 1 : -1; cars.push({ dir, x: dir > 0 ? R.pick([3.1, 5.0]) : -R.pick([3.1, 5.0]), p: R.range(0, SPAN), v: R.range(9, 17) }); }
const carBody = share(FS.inst(box, new THREE.MeshLambertMaterial(), cars.length, (i, d, c) => c.copy(FS.col(R.pick(['#1a1a26', '#2a1530', '#0f2030'])))));
const carLights = share(FS.inst(box, new THREE.MeshBasicMaterial(), cars.length * 2, (i, d, c) => c.copy((i & 1) ? FS.col('#ff1a2e', 4) : FS.col('#eaf4ff', 6))));
const carGlow = FS.glows(cars.flatMap(() => [{ pos: [0, 0, 0], color: '#dfeeff', size: 9, k: 0.7 }, { pos: [0, 0, 0], color: '#ff2030', size: 6, k: 0.6 }]));
dyn.add(carGlow); const cgm = new THREE.Points(carGlow.geometry, carGlow.material); cgm.frustumCulled = false; dynMirror.add(cgm);

// Fluggleiter über der Straße
const fly = []; for (let i = 0; i < 9; i++) fly.push({ dir: i % 2 ? 1 : -1, x: R.range(-8, 8), y: R.range(20, 46), p: R.range(0, SPAN), v: R.range(22, 40) });
const flyBody = share(FS.inst(box, new THREE.MeshLambertMaterial(), fly.length, (i, d, c) => c.copy(FS.col('#11111a'))));
const flyGlow = FS.glows(fly.flatMap((f, i) => [{ pos: [0, 0, 0], color: '#ffffff', size: 7, k: 1 }, { pos: [0, 0, 0], color: NEON[i % NEON.length], size: 9, k: 0.9 }]));
dyn.add(flyGlow);

// Passanten mit leuchtenden Schirmen
const ppl = []; for (let i = 0; i < 46; i++) { const s = i % 2 ? 1 : -1; ppl.push({ x: s * R.range(6.8, 9.3), p: R.range(0, SPAN), v: R.range(0.7, 1.5) * R.pick([-1, 1]), ph: R.range(0, 6) }); }
const pplBody = share(FS.inst(box, new THREE.MeshLambertMaterial(), ppl.length, (i, d, c) => c.copy(FS.col('#0b0b12'))));
const pplUmb = share(FS.inst(new THREE.ConeGeometry(0.72, 0.3, 10), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85 }), ppl.length, (i, d, c) => c.copy(FS.col(R.pick(NEON.concat(['#e8e8ff', '#e8e8ff'])), R.range(0.5, 1.5)))));

// Regen
const RAIN = 1700, rainPos = new Float32Array(RAIN * 6), drops = [];
for (let i = 0; i < RAIN; i++) drops.push({ x: R.range(-26, 26), y: R.range(0, 30), z: R.range(-46, 22), v: R.range(22, 34) });
const rainGeo = new THREE.BufferGeometry(); rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: FS.col('#9fb4ff', 0.9), transparent: true, opacity: 0.32, depthWrite: false })); rain.frustumCulled = false; FS.add(rain);

// Dampf aus Schächten
const steam = []; for (let i = 0; i < 26; i++) steam.push({ x: R.pick([-6.6, 6.6, -3, 3]) + R.range(-0.5, 0.5), p: R.range(0, SPAN), y: R.range(0, 7), col: R.pick(NEON) });
const steamGlow = FS.glows(steam.map((s) => ({ pos: [0, 0, 0], color: s.col, size: 14, k: 0.07 }))); dyn.add(steamGlow);

/* ---------- Kamera ---------- */
FS.rig.cruise((d) => {
  const z = -(d % L), x = Math.sin(d * 0.021) * 1.1, lift = FS.smooth((Math.sin(d * 0.0131 - 1.2) - 0.55) / 0.45), y = 2.3 + Math.sin(d * 0.017) * 0.4 + lift * 7.5;
  return [new THREE.Vector3(x, y, z), new THREE.Vector3(Math.sin((d + 26) * 0.021) * 0.8, y * 0.72 + 1.7, z - 26)];
}, { speed: 7.5 });

/* ---------- Animation ---------- */
let flash = 0;
FS.onUpdate((dt, t) => {
  const cz = FS.camera.position.z, base = FS.rig.dist;      // base = zurückgelegte Strecke ohne Umbruch
  holoMat.uniforms.time.value = t;
  // Autos
  const cg = carGlow.geometry.attributes.position;
  cars.forEach((c, i) => {
    c.p += c.dir * c.v * dt; const z = cz + wrapRel(c.p - (-base));
    dummy.rotation.set(0, 0, 0); dummy.position.set(c.x, 0.62, z); dummy.scale.set(1.75, 0.95, 4.2); dummy.updateMatrix(); carBody.setMatrixAt(i, dummy.matrix);
    const fz = z + c.dir * 2.12, bz = z - c.dir * 2.12;
    dummy.position.set(c.x, 0.62, fz); dummy.scale.set(1.5, 0.16, 0.08); dummy.updateMatrix(); carLights.setMatrixAt(i * 2, dummy.matrix);
    dummy.position.set(c.x, 0.7, bz); dummy.updateMatrix(); carLights.setMatrixAt(i * 2 + 1, dummy.matrix);
    cg.setXYZ(i * 2, c.x, 0.7, fz + c.dir * 0.4); cg.setXYZ(i * 2 + 1, c.x, 0.75, bz - c.dir * 0.3);
  });
  carBody.instanceMatrix.needsUpdate = true; carLights.instanceMatrix.needsUpdate = true; cg.needsUpdate = true;
  // Fluggleiter
  const fg = flyGlow.geometry.attributes.position;
  fly.forEach((f, i) => {
    f.p += f.dir * f.v * dt; const z = cz + wrapRel(f.p - (-base)), y = f.y + Math.sin(t * 0.6 + i) * 1.2;
    dummy.rotation.set(0, 0, 0); dummy.position.set(f.x, y, z); dummy.scale.set(1.6, 0.45, 3.6); dummy.updateMatrix(); flyBody.setMatrixAt(i, dummy.matrix);
    fg.setXYZ(i * 2, f.x, y, z + f.dir * 1.9); fg.setXYZ(i * 2 + 1, f.x, y - 0.3, z - f.dir * 1.9);
  });
  flyBody.instanceMatrix.needsUpdate = true; fg.needsUpdate = true;
  // Passanten
  ppl.forEach((p, i) => {
    p.p += p.v * dt; const z = cz + wrapRel(p.p - (-base)), bob = Math.abs(Math.sin(t * 5 * Math.abs(p.v) + p.ph)) * 0.05;
    dummy.rotation.set(0, 0, 0); dummy.position.set(p.x, 0.98 + bob, z); dummy.scale.set(0.46, 1.6, 0.3); dummy.updateMatrix(); pplBody.setMatrixAt(i, dummy.matrix);
    dummy.position.set(p.x, 2.02 + bob, z); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); pplUmb.setMatrixAt(i, dummy.matrix);
  });
  pplBody.instanceMatrix.needsUpdate = true; pplUmb.instanceMatrix.needsUpdate = true;
  // Regen: fällt in einem Kasten, der der Kamera folgt
  const cx = FS.camera.position.x;
  for (let i = 0; i < RAIN; i++) {
    const d = drops[i]; d.y -= d.v * dt; if (d.y < 0) { d.y += 30; d.x = R.range(-26, 26); d.z = R.range(-46, 22); }
    const o = i * 6; rainPos[o] = cx + d.x; rainPos[o + 1] = d.y; rainPos[o + 2] = cz + d.z; rainPos[o + 3] = cx + d.x + 0.12; rainPos[o + 4] = d.y + 1.05; rainPos[o + 5] = cz + d.z;
  }
  rainGeo.attributes.position.needsUpdate = true;
  // Dampf
  const sg = steamGlow.geometry.attributes.position;
  steam.forEach((s, i) => { s.y += dt * 1.1; if (s.y > 8) s.y = 0; sg.setXYZ(i, s.x + Math.sin(t * 0.5 + i) * 0.8, 0.5 + s.y, cz + wrapRel(s.p - (-base))); });
  sg.needsUpdate = true;
  // Blitz klingt ab
  flash = Math.max(0, flash - dt * 2.2);
  const fl = flash * flash * (0.6 + 0.4 * Math.sin(t * 60));
  hemi.intensity = 1.1 + fl * 9; FS.post.exposure = 1.05 + fl * 0.5;
});

/* ---------- Interaktion: Tippen löst Blitz und Donner aus ---------- */
function lightning() {
  flash = 1;
  FS.audio.whoosh({ color: 'brown', type: 'lowpass', from: 900, to: 70, dur: 3.2, attack: 0.03, gain: 0.9, reverb: 0.6 });
  FS.audio.whoosh({ color: 'white', type: 'bandpass', from: 5000, to: 900, dur: 0.5, attack: 0.01, gain: 0.25, reverb: 0.4 });
}
FS.onTap(lightning);

/* ---------- Ton: Regen, Stadt, langsamer Synth ---------- */
FS.onStart(() => {
  const A = FS.audio; if (!A.ctx) return;
  A.noise({ color: 'pink', type: 'bandpass', freq: 2600, q: 0.35, gain: 0.17 });                 // Regen
  A.noise({ color: 'white', type: 'highpass', freq: 6500, gain: 0.02 });                        // Zischen
  A.noise({ color: 'brown', type: 'lowpass', freq: 170, gain: 0.3 });                           // Stadtgrollen
  const chords = [[50, 57, 60, 65], [46, 53, 58, 62], [41, 48, 57, 60], [48, 55, 59, 64]];      // Dm7, B, F, C
  const pad = A.pad(chords[0], { gain: 0.05, cutoff: 750, reverb: 0.7 });
  const scale = [62, 65, 67, 69, 72, 74, 77];
  A.loop({ bpm: 84, div: 4, fn(i, time, sd) {
    const bar = Math.floor(i / 16) % 4, s = i % 16, root = chords[bar][0] - 12;
    if (s === 0) pad.to(chords[bar], 1.5);
    if (s === 0 || s === 10) A.kick(time, 0.42);
    if (s === 4 || s === 12) A.snare(time, 0.1);
    if (s % 2 === 0) A.hat(time, s % 4 === 2 ? 0.07 : 0.03);
    if ([0, 3, 6, 10, 13].includes(s)) A.tone(root, { time, dur: sd * 1.6, wave: 'sawtooth', gain: 0.2, cutoff: 420, sweep: 160, release: 0.12 });
    if ((i * 7 + bar * 3) % 5 < 2) A.tone(scale[(i * 5 + bar * 2) % scale.length] + (s > 8 ? 12 : 0), { time, dur: sd * 0.8, wave: 'triangle', gain: 0.055, cutoff: 3200, reverb: 0.8, release: 0.5 });
  } });
});
