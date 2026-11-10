/* ==========================================================================
   SZENE — ab hier alles ersetzen. Dieses Beispiel zeigt nur, wie Stationen
   angelegt werden: drei Stationen, jede eine kleine Insel.
   ========================================================================== */
FS.setup({
  title: 'Titel der Zeitreise', subtitle: 'Von wann bis wann, in wie vielen Stationen.', button: 'Reise starten',
  hint: 'Zeitachse antippen oder Pfeiltasten · läuft sonst von selbst',
  seed: 1, fov: 55, background: '#0a0806', fog: ['#0a0806', 0.019],
  post: { bloom: 1.15, vignette: 0.5, grain: 0.045, aberration: 0.003 }
});
const R = FS.rand, RS = FS.reise, A = FS.audio;
RS.dwell = 7;                                      // Sekunden pro Station
RS.travel = 3.4;                                   // Sekunden Fahrt dazwischen

FS.add(new THREE.HemisphereLight(FS.col('#8a93b8'), FS.col('#1a1410'), 0.6));
const key = new THREE.PointLight(FS.col('#ffd0a0'), 2.2, 70, 1.6); FS.add(key);
FS.onUpdate(() => key.position.set(3, 6.5, -RS.pos * RS.spacing + 7));    // Hauptlicht fährt mit

function island(g, color) { const m = new THREE.Mesh(new THREE.CylinderGeometry(13, 15.5, 1.4, 56), new THREE.MeshLambertMaterial({ color: FS.col(color) })); m.position.y = -0.7; g.add(m); }

// Eine Station: Jahr, Anzeige, Kurzform für die Achse, Titel, Text, Farbstimmung, Aufbau, Bewegung
RS.epoch({ year: -10000, display: 'vor 12.000 Jahren', label: '12.000', tint: '#1c1407',
  title: 'Titel der Station', text: 'Ein bis zwei Sätze. Nur belegte Fakten.',
  build(g, e) { island(g, '#5a4420'); e.thing = new THREE.Mesh(new THREE.ConeGeometry(2, 4, 12), new THREE.MeshLambertMaterial({ color: FS.col('#c8962c') })); e.thing.position.y = 2; g.add(e.thing); },
  update(dt, t, near) { this.thing.rotation.y = t * 0.4; } });

RS.epoch({ year: 1969, label: '1969', tint: '#020307',
  title: 'Zweite Station', text: 'Jahreszahlen ab dem Jahr 1 brauchen keine eigene Anzeige.',
  build(g, e) { island(g, '#8a8d92'); g.add(FS.glows(Array.from({ length: 200 }, () => ({ pos: [R.range(-40, 40), R.range(2, 30), R.range(-40, -12)], color: '#ffffff', size: R.range(0.3, 0.9), k: 1 })), { fog: 0 })); } });

// prognose:true zeigt das Schild „Prognose“. Der Text sagt offen, dass es ein Szenario ist
RS.epoch({ year: 2056, label: '2056', prognose: true, tint: '#0b0618',
  title: 'Blick nach vorn', text: 'Ein Szenario, keine Tatsache: so könnte es weitergehen.',
  build(g, e) { island(g, '#1a1230'); e.ring = new THREE.Mesh(new THREE.TorusGeometry(3, 0.04, 6, 90), new THREE.MeshBasicMaterial({ color: FS.col('#c08aff', 2.6) })); e.ring.position.y = 4; g.add(e.ring); },
  update(dt, t) { this.ring.rotation.set(t * 0.4, t * 0.3, 0); } });

// Ton: wechselt mit der Station
FS.onStart(() => {
  if (!A.ctx) return;
  const chords = [[38, 45, 50, 53], [45, 52, 57, 60], [50, 57, 62, 66]], pad = A.pad(chords[0], { gain: 0.05, cutoff: 700, reverb: 0.8 });
  let last = -1;
  A.loop({ bpm: 66, div: 2, fn(i, time) {
    const e = Math.round(RS.pos), ch = chords[e];
    if (e !== last) { last = e; pad.to(ch, 2.5); A.whoosh({ time, from: 200, to: 1800, dur: 2.6, gain: 0.1, reverb: 0.8 }); }
    if (i % 8 === 0) A.tone(ch[0] - 12, { time, wave: 'sine', dur: 3, gain: 0.2 });
  } });
});
