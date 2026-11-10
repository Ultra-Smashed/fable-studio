/* ==========================================================================
   SZENE — ab hier alles ersetzen. Dieses Beispiel zeigt nur, wie die Bausteine
   benutzt werden: ein leuchtender Monolith auf spiegelndem Boden.
   ========================================================================== */
FS.setup({
  title: 'Titel der Welt', subtitle: 'Ein Satz, der neugierig macht.',
  hint: 'Ziehen: drehen · Scrollen: Zoom · Tippen: Impuls',
  seed: 1, fov: 55, background: '#05060c', fog: ['#05060c', 0.02],
  post: { bloom: 1.1, vignette: 0.45, grain: 0.04, aberration: 0.004 }
});
const R = FS.rand;

// Licht und Himmel
FS.add(new THREE.HemisphereLight(FS.col('#6a7ab8'), FS.col('#0a0a12'), 0.8));
FS.sky('#02030a', '#1a1440', '#05060c');

// Alles, was sich im Boden spiegeln soll, kommt in eine Gruppe
const world = new THREE.Group();
const mono = new THREE.Mesh(new THREE.BoxGeometry(1.2, 6, 1.2), new THREE.MeshBasicMaterial({ color: FS.col('#5fd8ff', 2.6) }));   // k > 1.5 leuchtet
mono.position.y = 3; world.add(mono);
world.add(FS.inst(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial(), 60, (i, d, c) => {                                  // 60 Blöcke, ein Zeichenaufruf
  const a = R.range(0, 6.283), r = R.range(6, 26), h = R.range(0.6, 7);
  d.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r); d.scale.set(R.range(0.8, 2), h, R.range(0.8, 2)); c.copy(FS.col(R.pick(['#1a1d33', '#22183a', '#14202e'])));
}));
const sparks = FS.glows(Array.from({ length: 120 }, () => ({ pos: [R.range(-20, 20), R.range(0.5, 12), R.range(-20, 20)], color: R.pick(['#5fd8ff', '#ff7ad9', '#ffffff']), size: R.range(0.3, 1), k: 1 })));
world.add(sparks);
FS.add(world); FS.add(FS.mirror(world, 0));                                                                                           // Spiegelbild unter dem Boden
const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ color: FS.col('#070810'), transparent: true, opacity: 0.86, depthWrite: false }));
floor.rotation.x = -Math.PI / 2; floor.renderOrder = -5; FS.add(floor);

// Kamera: kreist um das Ziel
FS.rig.orbit([0, 2.5, 0], 16, { pitch: 0.2, autoRotate: 0.1 });

// Bewegung
let pulse = 0;
FS.onUpdate((dt, t) => {
  pulse = Math.max(0, pulse - dt * 1.5);
  mono.scale.setScalar(1 + pulse * 0.25); mono.rotation.y = t * 0.3; sparks.rotation.y = t * 0.03;
  FS.post.bloom = 1.1 + pulse * 1.2;
});

// Interaktion
FS.onTap(() => { pulse = 1; FS.audio.tone(72 + R.int(0, 4) * 3, { wave: 'sine', dur: 0.4, gain: 0.2, reverb: 0.8, release: 1.2 }); });

// Ton
FS.onStart(() => {
  const A = FS.audio; if (!A.ctx) return;
  A.pad([45, 52, 57, 60], { gain: 0.05, cutoff: 800 });
  A.noise({ color: 'brown', type: 'lowpass', freq: 200, gain: 0.12 });
  A.loop({ bpm: 80, div: 2, fn(i, time) { if (i % 8 === 0) A.tone(33, { time, wave: 'sine', dur: 2, gain: 0.22 }); if (i % 3 === 0) A.tone([69, 72, 76, 79][i % 4], { time, wave: 'triangle', dur: 0.3, gain: 0.05, reverb: 0.8, release: 0.8 }); } });
});
