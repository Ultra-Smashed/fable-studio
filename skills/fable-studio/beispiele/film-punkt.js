/* ==========================================================================
   SZENE — „Mach einen Kurzfilm über einen einfachen Punkt“
   ========================================================================== */
FS.setup({
  title: 'Der Punkt', subtitle: 'Ein Kurzfilm über den kleinsten Baustein der Geometrie. 55 Sekunden.', button: 'Film starten', hint: '',
  seed: 11, fov: 50, background: '#03040a', fog: ['#03040a', 0.011],
  post: { bloom: 1.35, vignette: 0.6, grain: 0.05, aberration: 0.003 }
});
FS.rig.manual();
const R = FS.rand, N = 2600, A = FS.audio;

/* ---------- Bühne ---------- */
const grid = new THREE.GridHelper(600, 240, FS.col('#22366e'), FS.col('#0e1836')); grid.position.y = -1; FS.add(grid);

/* ---------- Formationen: dieselben 2600 Lichtpunkte ordnen sich immer neu ---------- */
const F = {}, mk = (fn) => { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const p = fn(i, i / N); a[i * 3] = p[0]; a[i * 3 + 1] = p[1]; a[i * 3 + 2] = p[2]; } return a; };
F.scatter = mk(() => { const r = R.range(45, 170), a = R.range(0, 6.283), y = R.range(-0.15, 0.9); return [Math.cos(a) * r, y * r * 0.6 + 4, Math.sin(a) * r]; });
F.line = mk((i, u) => [-4 + 8 * u, R.range(-0.03, 0.03), R.range(-0.03, 0.03)]);
const TRI = [[-4, 0, 0], [4, 0, 0], [0, 6, 0]];
F.tri = mk((i, u) => { const e = Math.floor(u * 3) % 3, f = (u * 3) % 1, a = TRI[e], b = TRI[(e + 1) % 3]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 0]; });
const edges = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(4.6, 0)).attributes.position, EC = edges.count / 2;
F.ico = mk((i, u) => { const e = Math.floor(u * EC) % EC, f = (u * EC) % 1, a = e * 2, b = a + 1; return [edges.getX(a) + (edges.getX(b) - edges.getX(a)) * f, 3 + edges.getY(a) + (edges.getY(b) - edges.getY(a)) * f, edges.getZ(a) + (edges.getZ(b) - edges.getZ(a)) * f]; });
F.sphere = mk((i) => { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996; return [Math.cos(a) * r * 5.2, 3 + y * 5.2, Math.sin(a) * r * 5.2]; });
F.heart = mk(() => { const t = R.range(0, 6.283), k = Math.sqrt(R()), x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); return [x * 0.36 * k, 3.6 + y * 0.36 * k, R.range(-1, 1) * (1 - k * 0.8) * 1.6]; });
const stagger = new Float32Array(N); for (let i = 0; i < N; i++) stagger[i] = R();
const cloud = FS.add(FS.glows(Array.from({ length: N }, () => ({ pos: [0, 0, 0], color: '#9fc4ff', size: R.range(0.16, 0.5), k: R.range(0.3, 1) })), { fog: 0.25 }));
const cp = cloud.geometry.attributes.position, cc = cloud.geometry.attributes.color;
const baseCol = Float32Array.from(cc.array), warm = FS.col('#ff4d7a');
function morph(from, to, p) {                     // jeder Punkt startet leicht versetzt, das wirkt organisch
  const a = F[from], b = F[to], arr = cp.array;
  for (let i = 0; i < N; i++) { const e = FS.smooth(p * 1.5 - stagger[i] * 0.5), o = i * 3; arr[o] = a[o] + (b[o] - a[o]) * e; arr[o + 1] = a[o + 1] + (b[o + 1] - a[o + 1]) * e; arr[o + 2] = a[o + 2] + (b[o + 2] - a[o + 2]) * e; }
  cp.needsUpdate = true;
}
function tint(w) { const arr = cc.array; for (let i = 0; i < N; i++) { const o = i * 3, k = baseCol[o + 2]; arr[o] = baseCol[o] + (warm.r * k * 2.2 - baseCol[o]) * w; arr[o + 1] = baseCol[o + 1] + (warm.g * k * 2.2 - baseCol[o + 1]) * w; arr[o + 2] = baseCol[o + 2] + (warm.b * k * 2.2 - baseCol[o + 2]) * w; } cc.needsUpdate = true; }

/* ---------- Die drei Hauptfiguren ---------- */
function dot(color) {
  const g = new THREE.Group(), m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), new THREE.MeshBasicMaterial({ color: FS.col(color, 4) }));
  g.add(m); g.add(FS.glows([{ pos: [0, 0, 0], color, size: 1.7, k: 0.7 }], { fog: 0 })); g.scale.setScalar(0.0001); return FS.add(g);
}
const hero = dot('#ffffff'), second = dot('#5fd8ff'), third = dot('#ff7ad9');
const pop = (p) => p <= 0 ? 0.0001 : p >= 1 ? 1 : 1 + Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * 2.094) ;   // federndes Auftauchen
const hop = (t, speed) => Math.abs(Math.sin(t * speed));
function squash(g, h) { g.scale.set(1 + (1 - h) * 0.25, 0.75 + h * 0.35, 1 + (1 - h) * 0.25); }

/* ---------- Der Film ---------- */
const film = FS.film;
film.card('Der Punkt', 'Ein Kurzfilm', { dur: 3.5, cam: { from: { pos: [0, 2, 30], look: [0, 1, 0] }, to: { pos: [0, 1.6, 22], look: [0, 0.5, 0] } },
  update() { morph('scatter', 'scatter', 0); tint(0); hero.scale.setScalar(0.0001); second.scale.setScalar(0.0001); third.scale.setScalar(0.0001); } });

film.shot({ dur: 7, caption: 'Am Anfang war da nur ein Punkt.',
  cam: { from: { pos: [0, 1.4, 15], look: [0, 0, 0], fov: 50 }, to: { pos: [0, 0.5, 4.6], look: [0, 0, 0], fov: 42 }, ease: 'out' },
  enter() { A.tone(84, { wave: 'sine', dur: 1.2, gain: 0.16, reverb: 0.9, release: 1.5 }); },
  update(p, t) { morph('scatter', 'scatter', 0); hero.position.set(0, 0, 0); hero.scale.setScalar(pop(t / 1.2)); second.scale.setScalar(0.0001); third.scale.setScalar(0.0001); } });

film.shot({ dur: 7, caption: [[0.06, 'Keine Länge. Keine Breite.', 0.48], [0.54, 'Nur ein Ort im Nichts.', 0.95]],
  cam: { from: { pos: [3.5, 1, 6.5], look: [0, 0.2, 0], fov: 42 }, to: { pos: [-3.5, 1.5, 7.5], look: [0, 0.3, 0], fov: 46 } },
  update(p, t) { const x = Math.sin(t * 1.3) * 1.6 * FS.smooth(p * 3), h = hop(t, 3.4); hero.position.set(x, h * 0.55, 0); squash(hero, h); } });

film.shot({ dur: 8, caption: [[0.06, 'Dann kam ein zweiter.', 0.42], [0.5, 'Und zwischen ihnen entstand eine Linie.', 0.96]],
  cam: { from: { pos: [0, 2.2, 13], look: [0, 0, 0], fov: 46 }, to: { pos: [1.5, 1.2, 10], look: [0, 0, 0], fov: 46 } },
  enter() { A.tone(79, { wave: 'sine', dur: 1, gain: 0.14, reverb: 0.9, release: 1.4 }); A.whoosh({ time: A.ctx ? A.ctx.currentTime + 3.2 : 0, from: 200, to: 2400, dur: 2.4, gain: 0.12, reverb: 0.7 }); },
  update(p, t) { hero.scale.setScalar(1); hero.position.set(FS.lerp(0, -4, FS.smooth(p * 2.5)), 0, 0); second.position.set(4, hop(t, 3) * 0.3 * (1 - p), 0); second.scale.setScalar(pop((t - 0.8) / 1.1)); third.scale.setScalar(0.0001); morph('scatter', 'line', FS.clamp((p - 0.4) / 0.5, 0, 1)); } });

film.shot({ dur: 8.5, caption: [[0.05, 'Aus drei wurde eine Fläche.', 0.44], [0.54, 'Aus vielen ein Körper.', 0.96]],
  cam: { from: { pos: [7, 3, 13], look: [0, 2.6, 0], fov: 48 }, to: { pos: [-9, 5.5, 13.5], look: [0, 3, 0], fov: 48 } },
  enter() { A.tone(88, { wave: 'sine', dur: 1, gain: 0.13, reverb: 0.9, release: 1.4 }); A.whoosh({ time: A.ctx ? A.ctx.currentTime + 4.2 : 0, from: 300, to: 3200, dur: 2.2, gain: 0.14, reverb: 0.7 }); },
  update(p, t) { hero.position.set(-4, 0, 0); second.position.set(4, 0, 0); third.position.set(0, 6, 0); third.scale.setScalar(pop((t - 0.3) / 1.1));
    const out = 1 - FS.smooth((p - 0.5) / 0.2); hero.scale.setScalar(Math.max(out, 0.0001)); second.scale.setScalar(Math.max(out, 0.0001)); if (p > 0.5) third.scale.setScalar(Math.max(out, 0.0001));
    if (p < 0.5) morph('line', 'tri', FS.clamp(p / 0.36, 0, 1)); else morph('tri', 'ico', FS.clamp((p - 0.5) / 0.4, 0, 1)); tint(0); } });

film.shot({ dur: 10, caption: [[0.08, 'Und irgendwann verstand er:', 0.4], [0.48, 'Alles, was es gibt, besteht aus Punkten wie ihm.', 0.97]],
  cam: { from: { pos: [0, 3.2, 15], look: [0, 3.2, 0], fov: 48 }, to: { pos: [0, 4, 25], look: [0, 3.6, 0], fov: 44 }, ease: 'inOut' },
  enter() { A.whoosh({ time: A.ctx ? A.ctx.currentTime + 3.6 : 0, from: 150, to: 1800, dur: 3, gain: 0.16, reverb: 0.8 }); },
  update(p, t) { [hero, second, third].forEach((d) => d.scale.setScalar(0.0001));
    if (p < 0.4) morph('ico', 'sphere', FS.clamp(p / 0.3, 0, 1)); else morph('sphere', 'heart', FS.clamp((p - 0.4) / 0.32, 0, 1));
    tint(FS.smooth((p - 0.45) / 0.3)); const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 1.2)), 10) * FS.smooth((p - 0.7) / 0.1);
    cloud.scale.setScalar(1 + beat * 0.06); cloud.position.y = -beat * 0.2; FS.post.bloom = 1.35 + beat * 0.9; } });

film.shot({ dur: 8, caption: [[0.12, 'Er war nie allein.', 0.5], [0.58, 'Er war der Anfang.', 0.97]],
  cam: { from: { pos: [0, 1, 8], look: [0, 0.2, 0], fov: 44 }, to: { pos: [0, 0.6, 4.4], look: [0, 0.1, 0], fov: 40 }, ease: 'out' },
  enter() { cloud.scale.setScalar(1); cloud.position.y = 0; FS.post.bloom = 1.35; A.tone(84, { wave: 'sine', dur: 1.6, gain: 0.16, reverb: 0.9, release: 2 }); },
  update(p, t) { morph('heart', 'scatter', FS.clamp(p / 0.6, 0, 1)); tint(1 - FS.smooth(p / 0.5)); hero.position.set(0, 0, 0); const pulse = 1 + Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 1.2)), 10) * 0.35; hero.scale.setScalar(pop(t / 1.2) * pulse); } });

film.card('Ende', 'Ein Satz. Ein Film.', { dur: 4, cam: { from: { pos: [0, 0.6, 4.4], look: [0, 0.1, 0], fov: 40 }, to: { pos: [0, 1.5, 9], look: [0, 0.3, 0], fov: 44 } } });

/* ---------- Musik: wächst mit der Geschichte ---------- */
FS.onStart(() => {
  if (!A.ctx) return;
  const prog = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 57, 60], [43, 50, 55, 59]];   // C, a, F, G
  const pad = A.pad(prog[0], { gain: 0.045, cutoff: 800, reverb: 0.8, fadeIn: 5 });
  A.noise({ color: 'brown', type: 'lowpass', freq: 220, gain: 0.08 });
  const mel = [72, 76, 79, 76, 81, 79, 76, 74];
  A.loop({ bpm: 72, div: 2, fn(i, time) {
    const sh = film.i, bar = Math.floor(i / 8) % 4, s = i % 8, ch = prog[bar];
    if (film.done) return;
    if (s === 0) pad.to(sh >= 4 ? ch : prog[0], 2);
    if (sh >= 1 && sh <= 2 && s % 4 === 0) A.tone(mel[(i / 4) % 4], { time, wave: 'sine', dur: 0.5, gain: 0.09, reverb: 0.9, release: 1.2 });
    if (sh === 3) { if (s % 2 === 0) A.tone(mel[(i / 2) % 8], { time, wave: 'triangle', dur: 0.4, gain: 0.08, reverb: 0.8, release: 0.9 }); if (s === 0) A.tone(ch[0] - 12, { time, wave: 'sine', dur: 2.5, gain: 0.2, release: 0.8 }); }
    if (sh === 4 || sh === 5) {
      A.tone(ch[s % 4] + 12 + (s > 3 ? 12 : 0), { time, wave: 'triangle', dur: 0.3, gain: sh === 5 ? 0.085 : 0.065, reverb: 0.8, release: 0.8 });
      if (s === 0) { A.tone(ch[0] - 12, { time, wave: 'sine', dur: 3, gain: 0.24, release: 0.6 }); if (sh === 5) A.chord(ch.map((n) => n + 12), { time, wave: 'sawtooth', dur: 2.6, gain: 0.03, cutoff: 1400, reverb: 0.7, attack: 0.4, release: 1 }); }
      if (sh === 5 && s % 2 === 0) A.kick(time, 0.42);
    }
    if (sh >= 6 && s % 4 === 0) A.tone(mel[(i / 4) % 4], { time, wave: 'sine', dur: 0.8, gain: 0.08, reverb: 0.9, release: 1.6 });
    if (sh === 6 && (s === 0 || s === 1)) A.kick(time, 0.22);
  } });
});
