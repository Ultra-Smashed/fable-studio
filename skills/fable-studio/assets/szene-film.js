/* ==========================================================================
   SZENE — ab hier alles ersetzen. Dieses Beispiel zeigt nur, wie ein Film
   aus Einstellungen aufgebaut wird: Titel, zwei Einstellungen, Schluss.
   ========================================================================== */
FS.setup({
  title: 'Titel des Films', subtitle: 'Ein Satz zum Inhalt. Dauer in Sekunden.', button: 'Film starten', hint: '',
  seed: 1, fov: 50, background: '#04050a', fog: ['#04050a', 0.015],
  post: { bloom: 1.2, vignette: 0.55, grain: 0.05, aberration: 0.003 }
});
FS.rig.manual();                                   // im Film führt jede Einstellung die Kamera selbst
const A = FS.audio, film = FS.film;

FS.add(new THREE.HemisphereLight(FS.col('#8090c0'), FS.col('#0a0a10'), 0.9));
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 16), new THREE.MeshBasicMaterial({ color: FS.col('#ffd27a', 3) })); FS.add(ball);
const floor = new THREE.GridHelper(200, 100, FS.col('#22366e'), FS.col('#0e1836')); floor.position.y = -0.5; FS.add(floor);

// Titeltafel
film.card('Titel des Films', 'Ein Kurzfilm', { dur: 3.5,
  cam: { from: { pos: [0, 2, 16], look: [0, 0, 0] }, to: { pos: [0, 1.5, 12], look: [0, 0, 0] } },
  update() { ball.position.set(0, 0, 0); } });

// Einstellung: Kamerafahrt von-bis, Untertitel, update(p = 0..1, sekunden)
film.shot({ dur: 6, caption: 'Ein Untertitel pro Gedanke.',
  cam: { from: { pos: [0, 1.5, 12], look: [0, 0, 0], fov: 50 }, to: { pos: [0, 0.6, 4], look: [0, 0, 0], fov: 42 }, ease: 'out' },
  enter() { A.tone(84, { wave: 'sine', dur: 1, gain: 0.15, reverb: 0.9, release: 1.5 }); },
  update(p, t) { ball.position.set(0, Math.abs(Math.sin(t * 3)) * 0.8, 0); } });

// Mehrere Untertitel in einer Einstellung: [start, text, ende] als Anteil 0..1
film.shot({ dur: 7, caption: [[0.05, 'Erster Gedanke.', 0.45], [0.55, 'Zweiter Gedanke.', 0.95]],
  cam: { from: { pos: [5, 2, 7], look: [0, 0.4, 0] }, to: { pos: [-5, 3, 8], look: [0, 0.4, 0] } },
  update(p, t) { ball.position.set(Math.sin(p * 6.283) * 2, 0.3, 0); } });

film.card('Ende', '', { dur: 3.5, cam: { from: { pos: [-5, 3, 8], look: [0, 0.4, 0] }, to: { pos: [-6, 4, 12], look: [0, 0.4, 0] } } });

// Musik: richtet sich nach der laufenden Einstellung (film.i)
FS.onStart(() => {
  if (!A.ctx) return;
  const pad = A.pad([48, 55, 60, 64], { gain: 0.05, cutoff: 800, reverb: 0.8 });
  A.loop({ bpm: 72, div: 2, fn(i, time) {
    if (film.done) return;
    if (i % 8 === 0) A.tone(36, { time, wave: 'sine', dur: 2.5, gain: 0.2 });
    if (film.i >= 1 && i % 2 === 0) A.tone([72, 76, 79, 76][(i / 2) % 4], { time, wave: 'triangle', dur: 0.4, gain: 0.07, reverb: 0.8, release: 0.9 });
  } });
});
