/* ==========================================================================
   SZENE — „Zeig 3,3 Millionen Jahre Menschheit und die nächsten 30 Jahre“
   ========================================================================== */
FS.setup({
  title: '3,3 Millionen Jahre', subtitle: 'Vom ersten Steinwerkzeug bis zur KI und ein Blick nach vorn. Eine Zeitreise in neun Stationen.',
  button: 'Reise starten', hint: 'Zeitachse antippen oder Pfeiltasten · läuft sonst von selbst',
  seed: 5, fov: 55, background: '#1a0d06', fog: ['#1a0d06', 0.019],
  post: { bloom: 1.15, vignette: 0.5, grain: 0.045, aberration: 0.003 }
});
const R = FS.rand, RS = FS.reise, A = FS.audio, PI = Math.PI;
RS.dwell = 7; RS.travel = 3.4; RS.camOffset = [0, 3.4, 16]; RS.camLook = [0, 2.4, 0];

/* ---------- Licht: ein Hauptlicht wandert mit und wechselt die Farbe ---------- */
FS.add(new THREE.HemisphereLight(FS.col('#8a93b8'), FS.col('#1a1410'), 0.55));
const key = new THREE.PointLight(FS.col('#ffb070'), 2.2, 70, 1.6); FS.add(key);
const keyCols = [];

/* ---------- Bausteine ---------- */
const geo = { box: new THREE.BoxGeometry(1, 1, 1), sph: new THREE.SphereGeometry(1, 20, 14), cyl: new THREE.CylinderGeometry(1, 1, 1, 16), cone: new THREE.ConeGeometry(1, 1, 14), rock: new THREE.DodecahedronGeometry(1, 0) };
function solid(g, shape, color, pos, scale, rot) {            // matter Körper, reagiert auf Licht
  const m = new THREE.Mesh(geo[shape], new THREE.MeshLambertMaterial({ color: FS.col(color), flatShading: shape === 'rock' }));
  m.position.set(pos[0], pos[1], pos[2]); if (typeof scale === 'number') m.scale.setScalar(scale); else m.scale.set(scale[0], scale[1], scale[2]); if (rot) m.rotation.set(rot[0], rot[1], rot[2]); g.add(m); return m;
}
function lit(g, shape, color, k, pos, scale) {                 // selbstleuchtender Körper
  const m = new THREE.Mesh(geo[shape], new THREE.MeshBasicMaterial({ color: FS.col(color, k) }));
  m.position.set(pos[0], pos[1], pos[2]); if (typeof scale === 'number') m.scale.setScalar(scale); else m.scale.set(scale[0], scale[1], scale[2]); g.add(m); return m;
}
function island(g, color, r = 13) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 2.5, 1.4, 56), new THREE.MeshLambertMaterial({ color: FS.col(color) })); m.position.y = -0.7; g.add(m); return m; }
function person(g, x, z, h = 1.7, color = '#16110e', lean = 0) {
  const p = new THREE.Group(); solid(p, 'cyl', color, [0, h * 0.42, 0], [h * 0.13, h * 0.84, h * 0.13]); solid(p, 'sph', color, [0, h * 0.93, 0], h * 0.12);
  p.position.set(x, 0, z); p.rotation.z = lean; g.add(p); return p;
}
function stars(g, n, y0, spread, color = '#cfe0ff') { const l = []; for (let i = 0; i < n; i++) l.push({ pos: [R.range(-spread, spread), R.range(y0, y0 + 30), R.range(-40, -12)], color, size: R.range(0.3, 0.9), k: R.range(0.4, 1.4) }); const p = FS.glows(l, { fog: 0 }); g.add(p); return p; }

/* ---------- Die neun Stationen ---------- */
const ep = (o) => { keyCols.push(FS.col(o.key || '#ffffff')); return RS.epoch(o); };

// 1 · Steinwerkzeuge
ep({ year: -3300000, display: 'vor 3,3 Mio. Jahren', label: '3,3 Mio.', tint: '#1c0e06', key: '#ff9a55',
  title: 'Die ersten Werkzeuge', text: 'In Lomekwi am Turkana-See schlagen Vormenschen Steine zu Klingen. Es sind die ältesten bekannten Werkzeuge der Welt.',
  build(g, e) {
    island(g, '#6b4a2a'); lit(g, 'sph', '#ff7a2a', 2.2, [-9, 4.5, -26], 4.2); g.add(FS.glows([{ pos: [-9, 4.5, -25], color: '#ff8a3a', size: 60, k: 0.35 }], { fog: 0.35 }));
    solid(g, 'cyl', '#2a1a10', [6, 2.6, -4], [0.35, 5.2, 0.35], [0, 0, 0.12]); [[6.4, 5.6, -4, 4.2], [4.6, 5.1, -3.4, 2.6], [8, 5.2, -4.6, 2.8]].forEach((c) => solid(g, 'sph', '#28351a', [c[0], c[1], c[2]], [c[3], 0.7, c[3] * 0.8]));
    person(g, -1.2, 1, 1.35, '#1a120c', 0.25); person(g, 2.6, -1.5, 1.25, '#1a120c', -0.1);
    solid(g, 'rock', '#7d7468', [0.2, 0.35, 2.2], [0.75, 0.4, 0.6]); e.hammer = solid(g, 'rock', '#9a9084', [0.2, 1.6, 2.2], 0.32);
    for (let i = 0; i < 9; i++) solid(g, 'rock', '#6a6258', [R.range(-7, 7), 0.12, R.range(-5, 6)], R.range(0.12, 0.4));
    e.sparks = FS.glows(Array.from({ length: 14 }, () => ({ pos: [0.2, 0.7, 2.2], color: '#ffd27a', size: 0.5, k: 2 }))); g.add(e.sparks); e.sv = Array.from({ length: 14 }, () => [0, 0, 0, 9]);
  },
  update(dt, t, near) {
    const e = this, c = (t * 0.9) % 1, y = 0.75 + Math.abs(Math.cos(c * PI)) * 1.1; e.hammer.position.y = y;
    const sp = e.sparks.geometry.attributes.position;
    if (c < 0.52 && c > 0.47 && e.sv[0][3] > 0.4) { e.sv.forEach((v, i) => { v[0] = R.range(-2.5, 2.5); v[1] = R.range(1.5, 5); v[2] = R.range(-2.5, 2.5); v[3] = 0; sp.setXYZ(i, 0.2, 0.75, 2.2); }); if (near > 0.9 && A.ctx) A.tone(96 + R.int(0, 5), { wave: 'square', dur: 0.02, gain: 0.05, cutoff: 6000, release: 0.05, reverb: 0.3 }); }
    e.sv.forEach((v, i) => { v[3] += dt; v[1] -= 9 * dt; sp.setXYZ(i, sp.getX(i) + v[0] * dt, v[3] > 0.7 ? -5 : sp.getY(i) + v[1] * dt, sp.getZ(i) + v[2] * dt); }); sp.needsUpdate = true;
  } });

// 2 · Feuer
ep({ year: -1000000, display: 'vor 1 Mio. Jahren', label: '1 Mio.', tint: '#0b0503', key: '#ff7a2a',
  title: 'Das Feuer wird gezähmt', text: 'In der Wonderwerk-Höhle in Südafrika finden sich Spuren von kontrolliertem Feuer. Es bringt Wärme, Schutz und gekochtes Essen.',
  build(g, e) {
    island(g, '#3a2a20');
    for (let i = 0; i < 11; i++) { const a = PI * (i / 10), r = 10.5; solid(g, 'rock', '#2a2019', [Math.cos(a) * r, 1.5 + Math.sin(a) * 6.5, -5 + R.range(-1, 1)], R.range(2.2, 3.6), [R(), R(), R()]); }
    for (let i = 0; i < 5; i++) solid(g, 'cyl', '#2a1608', [0, 0.25, 1.5], [0.14, 2, 0.14], [PI / 2.4, (i / 5) * PI * 2, 0]);
    [[-3, 2.6], [3.1, 2.2], [-1.6, -1.2], [2, -1.4]].forEach((p, i) => person(g, p[0], p[1], 1.4, '#120c08', i % 2 ? 0.15 : -0.15));
    e.fl = Array.from({ length: 46 }, () => ({ p: R(), x: R.range(-0.5, 0.5), z: R.range(-0.5, 0.5), s: R.range(0.6, 1.4) }));
    e.fire = FS.glows(e.fl.map((f) => ({ pos: [0, 0, 0], color: R.pick(['#ff5a1a', '#ffa23a', '#ffd27a']), size: 1.3 * f.s, k: 0.4 }))); g.add(e.fire);
  },
  update(dt, t) { const fp = this.fire.geometry.attributes.position; this.fl.forEach((f, i) => { f.p = (f.p + dt * (0.5 + f.s * 0.35)) % 1; const w = 1 - f.p; fp.setXYZ(i, f.x * w + Math.sin(t * 3 + i) * 0.12, 0.4 + f.p * 3.2 * f.s, 1.5 + f.z * w); }); fp.needsUpdate = true; } });

// 3 · Homo sapiens
ep({ year: -300000, display: 'vor 300.000 Jahren', label: '300.000', tint: '#060914', key: '#8fb0ff',
  title: 'Homo sapiens', text: 'Die ältesten Funde unserer Art stammen aus Jebel Irhoud in Marokko. Der moderne Mensch betritt die Bühne.',
  build(g, e) {
    island(g, '#2a2c3a'); solid(g, 'rock', '#1c1e2a', [-7, 0.6, -5], [5, 2.4, 4]); solid(g, 'rock', '#1c1e2a', [8, 0.4, -6], [6, 2, 4]);
    [-2.6, -1, 0.7, 2.4, 4].forEach((x, i) => { const p = person(g, x, 1 - i * 0.3, 1.7 + (i % 3) * 0.2, '#343a5a'); if (i === 2) solid(p, 'cyl', '#0c0d14', [0.35, 1.2, 0], [0.03, 2.6, 0.03], [0, 0, -0.12]); });
    e.st = stars(g, 420, 2, 46); const band = []; for (let i = 0; i < 260; i++) { const u = R.range(-1, 1); band.push({ pos: [u * 44, 16 + u * 9 + R.range(-2.5, 2.5), -30 + R.range(-3, 3)], color: R.pick(['#bcd0ff', '#ffd9c0', '#ffffff']), size: R.range(0.4, 1.6), k: R.range(0.3, 1) }); }
    g.add(FS.glows(band, { fog: 0.35 }));
  } });

// 4 · Ackerbau
ep({ year: -10000, display: 'vor 12.000 Jahren', label: '12.000', tint: '#1c1407', key: '#ffd27a',
  title: 'Der Mensch wird sesshaft', text: 'Im Fruchtbaren Halbmond beginnen Menschen, Getreide anzubauen. Aus Lagern werden Dörfer.',
  build(g, e) {
    island(g, '#5a4420'); lit(g, 'sph', '#ffd27a', 2.4, [10, 11, -28], 3.2); g.add(FS.glows([{ pos: [10, 11, -27], color: '#ffd27a', size: 55, k: 0.3 }], { fog: 0.35 }));
    e.wheat = FS.inst(geo.cone, new THREE.MeshLambertMaterial(), 520, (i, d, c) => { const row = i % 13, k = Math.floor(i / 13); d.position.set(-9 + row * 0.9 + R.range(-0.1, 0.1), 0.55, 6 - k * 0.3 + R.range(-0.1, 0.1)); d.scale.set(0.07, R.range(0.9, 1.3), 0.07); d.rotation.z = R.range(-0.12, 0.12); c.copy(FS.col(R.pick(['#d9a93a', '#c8962c', '#e6bd55']))); });
    g.add(e.wheat);
    [[6, -2, 1.6], [9, 1, 1.3]].forEach((h) => { solid(g, 'cyl', '#7a5c38', [h[0], h[2] * 0.6, h[1]], [h[2], h[2] * 1.2, h[2]]); solid(g, 'cone', '#4a3418', [h[0], h[2] * 1.75, h[1]], [h[2] * 1.35, h[2] * 1.2, h[2] * 1.35]); });
    person(g, 4, 3, 1.6, '#2a1c10', 0.2); person(g, 2.2, 4.2, 1.5, '#2a1c10');
  },
  update(dt, t) { this.wheat.rotation.z = Math.sin(t * 0.9) * 0.012; } });

// 5 · Schrift
ep({ year: -3300, display: '3300 v. Chr.', label: '3300 v. Chr.', tint: '#140d06', key: '#ffc890',
  title: 'Die Schrift', text: 'In Uruk in Mesopotamien drücken Schreiber Zeichen in Ton. Wissen überdauert jetzt den, der es hat.',
  build(g, e) {
    island(g, '#6a5236'); [[9, 2.2], [7, 4], [5, 5.6], [3, 7]].forEach((s, i) => solid(g, 'box', '#7a6040', [0, i * 1.6 + 0.8, -9], [s[0] * 2, 1.6, s[0] * 1.2]));
    const tab = new THREE.Group(); tab.position.set(0, 2.9, 3.5); tab.rotation.x = -0.28; g.add(tab); solid(tab, 'box', '#a8845a', [0, 0, 0], [5.4, 3.8, 0.4]);
    e.marks = []; for (let r = 0; r < 6; r++) for (let c = 0; c < 11; c++) { const m = lit(tab, 'cone', '#ffcf8a', 2.4, [-2.2 + c * 0.44 + R.range(-0.05, 0.05), 1.4 - r * 0.56, 0.24], [0.07, 0.3, 0.03]); m.rotation.z = R.pick([0, PI / 2, PI / 4, -PI / 4, PI]); m.visible = false; e.marks.push(m); }
    person(g, -4.4, 4.5, 1.6, '#2a1c10', -0.1);
  },
  update(dt, t, near) { const n = Math.floor(((t * 5) % (this.marks.length + 25))); this.marks.forEach((m, i) => { m.visible = i < n; }); } });

// 6 · Buchdruck
ep({ year: 1450, label: '1450', tint: '#0d0a08', key: '#ffe2b0',
  title: 'Der Buchdruck', text: 'Gutenberg druckt in Mainz mit beweglichen Lettern. Bücher werden bezahlbar, Ideen verbreiten sich schneller als je zuvor.',
  build(g, e) {
    island(g, '#3a2c20'); [[-1.6, 2.4, 0], [1.6, 2.4, 0]].forEach((p) => solid(g, 'box', '#4a2f1a', [p[0], p[1], p[2]], [0.4, 4.8, 0.5])); solid(g, 'box', '#4a2f1a', [0, 4.7, 0], [3.8, 0.4, 0.6]); solid(g, 'box', '#3a2414', [0, 1, 0.3], [3, 0.3, 2.2]);
    solid(g, 'cyl', '#2a1a10', [0, 3.6, 0], [0.16, 1.8, 0.16]); e.plate = solid(g, 'box', '#5a3a20', [0, 2.2, 0.3], [2.4, 0.25, 1.6]);
    e.pages = []; for (let i = 0; i < 34; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.2), new THREE.MeshBasicMaterial({ color: FS.col('#fff4dc', 1.15), side: THREE.DoubleSide })); g.add(m); e.pages.push({ m, p: i / 34, a: R.range(-1, 1), s: R.range(0.7, 1.3) }); }
    g.add(FS.inst(geo.box, new THREE.MeshLambertMaterial(), 96, (i, d, c) => { d.position.set(-5.5 + (i % 12) * 0.34, 0.2 + Math.floor(i / 12) * 0.001, 4 + Math.floor(i / 12) * 0.34); d.scale.set(0.28, R.range(0.25, 0.4), 0.28); c.copy(FS.col('#8a8f98')); }));
    person(g, 3.4, 1.2, 1.7, '#1a1410', 0.08);
  },
  update(dt, t) { this.plate.position.y = 1.5 + Math.abs(Math.sin(t * 1.2)) * 1.1; this.pages.forEach((q) => { q.p = (q.p + dt * 0.11 * q.s) % 1; const u = q.p; q.m.position.set(q.a * u * 9, 1.4 + u * 9 + Math.sin(u * 7 + q.a * 3) * 0.6, 0.6 + u * 3 - u * u * 14); q.m.rotation.set(u * 5 * q.s, u * 4 + q.a, Math.sin(t + q.a * 5) * 0.6); q.m.scale.setScalar(Math.min(1, u * 8) * (1 - FS.smooth((u - 0.8) / 0.2))); }); } });

// 7 · Mondlandung
ep({ year: 1969, label: '1969', tint: '#020307', key: '#ffffff',
  title: 'Die Mondlandung', text: 'Am 20. Juli 1969 landen mit Apollo 11 die ersten Menschen auf dem Mond.',
  build(g, e) {
    island(g, '#8a8d92', 14); for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(R.range(0.5, 1.6), 0.12, 6, 20), new THREE.MeshLambertMaterial({ color: FS.col('#6d7076') })); m.rotation.x = PI / 2; m.scale.z = 0.3; m.position.set(R.range(-9, 9), 0.02, R.range(-6, 7)); g.add(m); }
    const L = new THREE.Group(); L.position.set(-2.2, 0, -0.5); g.add(L); solid(L, 'cyl', '#c9a23a', [0, 1.5, 0], [1.3, 1.1, 1.3]); solid(L, 'box', '#b8bcc4', [0, 2.7, 0], [1.6, 1.3, 1.5]); solid(L, 'cone', '#8a8d92', [0, 0.7, 0], [0.7, 0.7, 0.7]);
    for (let i = 0; i < 4; i++) { const a = i * PI / 2 + PI / 4; solid(L, 'cyl', '#b8bcc4', [Math.cos(a) * 1.5, 0.75, Math.sin(a) * 1.5], [0.05, 1.9, 0.05], [Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]); solid(L, 'cyl', '#c9a23a', [Math.cos(a) * 1.95, 0.05, Math.sin(a) * 1.95], [0.3, 0.08, 0.3]); }
    solid(g, 'cyl', '#d8d8d8', [2.6, 1.3, 1.5], [0.03, 2.6, 0.03]); const f = lit(g, 'box', '#ffffff', 0.9, [3.25, 2.25, 1.5], [1.3, 0.7, 0.02]); lit(g, 'box', '#2a4a9a', 0.9, [2.88, 2.42, 1.52], [0.5, 0.34, 0.02]);
    const as = person(g, 1, 2.6, 1.8, '#e8e8ee'); solid(as, 'box', '#d0d0d8', [0, 1.15, -0.3], [0.5, 0.7, 0.3]);
    e.earth = lit(g, 'sph', '#3a7bff', 1.3, [9, 13, -30], 2.6); g.add(FS.glows([{ pos: [9, 13, -29], color: '#5a9bff', size: 34, k: 0.35 }], { fog: 0.35 })); lit(g, 'sph', '#e8f4ff', 1.5, [8.1, 13.9, -28.2], [1.5, 0.5, 1]);
    stars(g, 500, 0, 50, '#ffffff');
  } });

// 8 · KI
ep({ year: 2022, label: '2022', tint: '#050816', key: '#6aa8ff',
  title: 'KI für alle', text: 'Sprachmodelle werden zum Alltagswerkzeug. Hunderte Millionen Menschen probieren sie in kurzer Zeit aus.',
  build(g, e) {
    island(g, '#141a2e'); const nodes = [], seg = [], layers = [5, 8, 8, 5];
    layers.forEach((n, l) => { for (let i = 0; i < n; i++) nodes.push({ l, pos: [-6 + l * 4, 1 + (i - (n - 1) / 2) * 1.05 + 3.2, R.range(-0.6, 0.6)] }); });
    nodes.forEach((a) => nodes.forEach((b) => { if (b.l === a.l + 1 && R.chance(0.55)) seg.push(a.pos[0], a.pos[1], a.pos[2], b.pos[0], b.pos[1], b.pos[2]); }));
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3)); e.lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: FS.col('#3a6aff', 0.9), transparent: true, opacity: 0.5 })); g.add(e.lines);
    e.nodes = nodes; e.ng = FS.glows(nodes.map((n) => ({ pos: n.pos, color: '#7ab8ff', size: 1.5, k: 1 }))); g.add(e.ng);
    e.core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), new THREE.MeshBasicMaterial({ color: FS.col('#9ad0ff', 2.2), wireframe: true })); e.core.position.set(8.6, 4.2, 0); g.add(e.core); g.add(FS.glows([{ pos: [8.6, 4.2, 0], color: '#6aa8ff', size: 14, k: 0.5 }]));
    for (let i = 0; i < 7; i++) { const p = person(g, -7 + i * 2.4 + R.range(-0.4, 0.4), 5 + R.range(-1, 1), 1.7, '#0a0d18'); lit(p, 'box', '#bfe0ff', 1.8, [0, 1.15, 0.22], [0.16, 0.28, 0.02]); }
  },
  update(dt, t) { const c = this.ng.geometry.attributes.color; this.nodes.forEach((n, i) => { const v = 0.35 + 1.5 * Math.pow(Math.max(0, Math.sin(t * 2.4 - n.l * 0.9 + i * 0.4)), 4); c.setXYZ(i, 0.2 * v, 0.5 * v, 1 * v); }); c.needsUpdate = true; this.core.rotation.set(t * 0.4, t * 0.6, 0); } });

// 9 · Prognose
ep({ year: 2056, label: '2056', prognose: true, tint: '#0b0618', key: '#c08aff',
  title: 'Forschung im Zeitraffer', text: 'Ein Szenario, keine Tatsache: KI-Systeme könnten Jahrzehnte an Forschung in wenige Jahre pressen. Ob und wie schnell das kommt, ist offen.',
  build(g, e) {
    island(g, '#1a1230'); e.helix = new THREE.Group(); e.helix.position.set(0, 0.5, 0); g.add(e.helix); const hl = [];
    for (let i = 0; i < 90; i++) { const a = i * 0.32, y = i * 0.11; hl.push({ pos: [Math.cos(a) * 1.5, y, Math.sin(a) * 1.5], color: '#ff7ad9', size: 0.9, k: 1.2 }, { pos: [Math.cos(a + PI) * 1.5, y, Math.sin(a + PI) * 1.5], color: '#5fd8ff', size: 0.9, k: 1.2 }); if (i % 3 === 0) for (let k = 1; k < 5; k++) hl.push({ pos: [Math.cos(a) * 1.5 * (1 - k * 0.4), y, Math.sin(a) * 1.5 * (1 - k * 0.4)], color: '#ffffff', size: 0.4, k: 0.5 }); }
    e.helix.add(FS.glows(hl));
    e.rings = [3.2, 4.6, 6.2].map((r, i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 6, 90), new THREE.MeshBasicMaterial({ color: FS.col(['#c08aff', '#5fd8ff', '#ff7ad9'][i], 2.4) })); m.position.y = 5; g.add(m); return m; });
    for (let i = 0; i < 16; i++) { const a = PI + (i / 15) * PI, r = R.range(8, 12), h = R.range(2, 9); solid(g, 'box', '#1a1436', [Math.cos(a) * r, h / 2, Math.sin(a) * r - 2], [0.9, h, 0.9]); lit(g, 'box', R.pick(['#c08aff', '#5fd8ff']), 2.6, [Math.cos(a) * r, h + 0.05, Math.sin(a) * r - 2], [0.92, 0.08, 0.92]); }
    stars(g, 300, 4, 46, '#d8c8ff');
  },
  update(dt, t) { this.helix.rotation.y = t * 0.5; this.rings.forEach((m, i) => m.rotation.set(t * (0.3 + i * 0.12), t * 0.2 * (i % 2 ? -1 : 1), i)); } });

/* ---------- Sternenstrom zwischen den Stationen ---------- */
const total = RS.eps.length * RS.spacing;
FS.add(FS.glows(Array.from({ length: 900 }, () => ({ pos: [R.range(-50, 50) || 1, R.range(-6, 34), 30 - R() * (total + 40)], color: R.pick(['#ffffff', '#ffd9b0', '#b0c8ff']), size: R.range(0.25, 0.7), k: R.range(0.4, 1.2) })), { fog: 0.4 }));

/* ---------- Hauptlicht folgt der Reise ---------- */
const kc = new THREE.Color();
FS.onUpdate(() => { const p = RS.pos, i0 = Math.floor(p), i1 = Math.min(i0 + 1, keyCols.length - 1); kc.copy(keyCols[i0]).lerp(keyCols[i1], p - i0); key.color.copy(kc); key.position.set(3, 6.5, -p * RS.spacing + 7); });

/* ---------- Ton: ein Akkord pro Epoche, vom Dunklen ins Helle ---------- */
FS.onStart(() => {
  if (!A.ctx) return;
  const chords = [[38, 45, 50, 53], [38, 45, 50, 53], [41, 48, 53, 57], [43, 50, 55, 59], [45, 52, 57, 60], [48, 55, 60, 64], [50, 57, 62, 66], [53, 60, 65, 69], [55, 62, 67, 71]];
  const pad = A.pad(chords[0], { gain: 0.05, cutoff: 700, reverb: 0.8 }); A.noise({ color: 'brown', type: 'lowpass', freq: 260, gain: 0.1 });
  let lastEp = -1;
  A.loop({ bpm: 66, div: 2, fn(i, time) {
    const e = Math.round(RS.pos), ch = chords[e], s = i % 8;
    if (e !== lastEp) { lastEp = e; pad.to(ch, 2.5); pad.filter.frequency.setTargetAtTime(600 + e * 170, time, 1.5); A.whoosh({ time, from: 200, to: 1600 + e * 200, dur: 2.6, gain: 0.1, reverb: 0.8 }); A.tone(ch[3] + 12, { time: time + 0.5, wave: 'sine', dur: 1.2, gain: 0.12, reverb: 0.9, release: 1.8 }); }
    if (s === 0) A.tone(ch[0] - 12, { time, wave: 'sine', dur: 3, gain: 0.2, release: 0.6 });
    if (e >= 3 && s % 2 === 0) A.tone(ch[(i / 2) % 4] + 12, { time, wave: 'triangle', dur: 0.35, gain: 0.03 + e * 0.006, reverb: 0.8, release: 0.9 });
    if (e >= 7) A.tone(ch[(i * 3) % 4] + 24, { time, wave: 'sine', dur: 0.15, gain: 0.035, reverb: 0.8, release: 0.5 });
  } });
});
