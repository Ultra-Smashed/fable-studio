# Das Grundgerüst: Bausteine und Fallen

Das Grundgerüst stellt ein Objekt `FS` bereit. Deine Szene läuft danach als gewöhnliches Skript und darf `FS` und `THREE` (three.js r128) benutzen.

## Inhalt
1. Einrichtung
2. Farben und Leuchten
3. Körper und Helfer
4. Kamera
5. Ablauf und Eingabe
6. Nachbearbeitung
7. Ton
8. Film
9. Zeitreise
10. Fallen in three.js r128

## 1. Einrichtung

```js
FS.setup({
  title: 'Titel', subtitle: 'Unterzeile auf dem Startbildschirm', hint: 'Bedienhinweis unten links', button: 'Starten',
  seed: 7,                       // gleicher Wert, gleiche Welt
  fov: 60,                       // Blickwinkel; im Hochformat weitet das Gerüst ihn selbst
  background: '#05060c',
  fog: ['#05060c', 0.02],        // Farbe, Dichte. 0.01 = weite Sicht, 0.03 = dicht
  post: { bloom: 1.1, vignette: 0.45, grain: 0.04, aberration: 0.004, exposure: 1, saturation: 1 }
});
```

Nebelfarbe und Hintergrund gleich wählen, sonst sieht man die Kante der Welt.

`FS.scene`, `FS.camera`, `FS.renderer` sind die üblichen three.js-Objekte. `FS.add(objekt)` hängt etwas in die Szene und gibt es zurück. `FS.rand` ist ein Zufallsgenerator mit festem Startwert: `FS.rand()` (0 bis 1), `.range(a, b)`, `.int(a, b)`, `.pick(liste)`, `.chance(p)`. Nimm ihn statt `Math.random`, damit die Welt bei jedem Laden gleich aussieht.

Mathe: `FS.clamp`, `FS.lerp`, `FS.smooth(t)` (weiches 0 bis 1), `FS.ease.out/in/inOut/linear`.

## 2. Farben und Leuchten

Farben immer über `FS.col(hex, k)` erzeugen. Das rechnet die Farbe richtig um. Der zweite Wert `k` ist die Helligkeit:

| k | Wirkung |
|---|---|
| 1 | normale Farbe |
| 1.5 bis 2 | glimmt leicht |
| 2.5 bis 4 | leuchtet stark, mit Lichthof (Neon, Lampen, Sonne) |
| über 5 | nur für sehr kleine Flächen wie Scheinwerfer |

Leuchtende Flächen brauchen `MeshBasicMaterial`, sie ignorieren das Szenenlicht:

```js
new THREE.MeshBasicMaterial({ color: FS.col('#ff2bd6', 3) })
```

Matte Körper, die auf Licht reagieren, bekommen `MeshLambertMaterial` und mindestens ein Licht in der Szene (`THREE.HemisphereLight` als Grundlicht, dazu ein bis zwei `DirectionalLight` oder ein `PointLight`). Lichtfarben ebenfalls über `FS.col`.

## 3. Körper und Helfer

**Viele gleiche Körper** (Gebäude, Fenster, Bäume, Halme): ein Zeichenaufruf für alle. Das ist der wichtigste Baustein für dichte Szenen.

```js
FS.inst(geometrie, material, anzahl, (i, d, c) => {
  d.position.set(x, y, z); d.scale.set(sx, sy, sz); d.rotation.y = w;   // d = Platzhalter für Lage
  c.copy(FS.col('#17152b'));                                            // c = Farbe dieses Körpers, auch mit Helligkeit
});
```

Zum Animieren später: `mesh.setMatrixAt(i, matrix)` und `mesh.instanceMatrix.needsUpdate = true`.

**Lichtpunkte** (Lichthöfe, Sterne, Funken, Feuer, Glühwürmchen, Dampf): weiche, additive Punkte.

```js
const p = FS.glows([{ pos: [x, y, z], color: '#ffd9a0', size: 9, k: 0.5 }, ...], { fog: 0.6 });
```

`size` ist der Durchmesser in Metern, `k` die Helligkeit. Große, schwache Punkte (size 10 bis 40, k 0.1 bis 0.3) ergeben Lichtschein in der Luft. Kleine, helle (size 0.3 bis 1, k 1 bis 2) ergeben Funken und Sterne. `fog: 0` lässt sie durch den Nebel scheinen (Sterne, Sonne). Bewegen über `p.geometry.attributes.position.setXYZ(i, x, y, z)` und `.needsUpdate = true`, umfärben über das Attribut `color`.

**Schrift** als Textur für Schilder und Tafeln:

```js
const tex = FS.textTex('ラーメン', { vertical: true, size: 120, color: '#ff2bd6', bg: '#06060b', border: '#ff2bd6' });
const sign = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tex, color: FS.col('#ffffff', 2.6) }));
sign.scale.set(breite, breite / tex.userData.aspect, 1);
```

**Eigene Textur** malen: `FS.canvasTex(breite, hoehe, (g, w, h) => { ...Canvas-2D-Befehle... })`.

**Spiegelung** für nasse Böden, Wasser, Glas: Alles, was sich spiegeln soll, in eine Gruppe, dann

```js
FS.add(gruppe); FS.add(FS.mirror(gruppe, 0));     // 0 = Höhe der Spiegelfläche
const boden = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ color: FS.col('#070810'), transparent: true, opacity: 0.86, depthWrite: false }));
boden.rotation.x = -Math.PI / 2; boden.renderOrder = -5; FS.add(boden);
```

Die Deckkraft des Bodens regelt die Stärke: 0.8 spiegelt deutlich, 0.95 nur die hellsten Lichter. Das Spiegelbild ist eine Kopie. Was sich bewegt, muss man in der Kopie mitbewegen oder sich die Attribute teilen (siehe `beispiele/welt-tokio.js`, Funktion `share`).

**Himmel:** `FS.sky(oben, horizont, unten)` als Farbverlauf.

**Trefferprüfung:** `FS.hit(x, y, [objekte])` liefert beim Antippen das getroffene Objekt oder `null`.

**Meldung einblenden:** `FS.toast('Text', sekunden)`.

## 4. Kamera

Genau eine dieser vier Arten wählen:

```js
// Fahrt entlang von Punkten, als Schleife. Ziehen = umsehen, Scrollen = Tempo
FS.rig.path([[0, 3, 0], [20, 4, -30], [0, 8, -60], [-20, 4, -30]], { speed: 6, lookAhead: 10 });

// Freie Fahrt: Funktion liefert zu jeder Strecke d Position und Blickpunkt (für endlose Welten)
FS.rig.cruise((d) => [new THREE.Vector3(0, 2.5, -(d % 160)), new THREE.Vector3(0, 3, -(d % 160) - 25)], { speed: 7 });

// Kreisen um ein Ziel. Ziehen = drehen, Scrollen = Zoom
FS.rig.orbit([0, 2, 0], 16, { pitch: 0.2, autoRotate: 0.1 });

// Selbst steuern (Film setzt die Kamera pro Einstellung, Zeitreise fährt von selbst)
FS.rig.manual();
```

`FS.rig.dist` ist die zurückgelegte Strecke bei Fahrten.

## 5. Ablauf und Eingabe

```js
FS.onUpdate((dt, t) => { ... });     // jedes Bild. dt = Sekunden seit dem letzten Bild, t = Gesamtzeit
FS.onStart(() => { ... });           // nach dem Klick auf Starten. Erst hier darf Ton beginnen
FS.onTap((x, y) => { ... });         // Antippen oder Klick, x und y von -1 bis 1
FS.onKey((taste) => { ... });        // Tastatur. Belegt sind schon: M (Ton), R (Aufnahme), Leertaste, Pfeile
```

Die Szene läuft schon vor dem Start hinter dem Startbildschirm. `FS.started` sagt, ob gestartet wurde, `FS.rec`, ob der Aufnahme-Modus läuft, `FS.portrait`, ob das Bild hochkant ist.

Bewegung immer mit `dt` oder `t` rechnen, nie pro Bild einen festen Schritt. Sonst läuft es auf schnellen Bildschirmen doppelt so schnell.

## 6. Nachbearbeitung

`FS.post` lässt sich jederzeit ändern, auch pro Bild: `bloom` (Lichthof, 0.8 bis 1.5), `vignette` (dunkle Ränder), `grain` (Filmkorn), `aberration` (Farbsaum am Rand), `exposure` (Belichtung, gut für Blitze), `saturation`, `threshold` (ab welcher Helligkeit etwas leuchtet).

## 7. Ton

Alles in `FS.onStart` aufbauen und mit `if (!FS.audio.ctx) return;` beginnen. Einzelheiten und Rezepte in `references/audio.md`. Kurzfassung:

```js
const A = FS.audio;
A.noise({ color: 'pink', type: 'bandpass', freq: 2600, q: 0.4, gain: 0.17 });   // Dauerrauschen: Regen, Wind, Meer
const pad = A.pad([50, 57, 60, 65], { gain: 0.05, cutoff: 750 });               // liegender Akkord
pad.to([46, 53, 58, 62], 1.5);                                                   // Akkord wechseln
A.loop({ bpm: 84, div: 4, fn(i, time, schrittDauer) { ... } });                  // Taktgeber
A.tone(60, { time, wave: 'triangle', dur: 0.3, gain: 0.08, reverb: 0.8 });       // einzelner Ton (60 = mittleres C)
A.kick(time, 0.4); A.snare(time, 0.1); A.hat(time, 0.05);                        // Schlagzeug
A.whoosh({ from: 200, to: 2400, dur: 2, gain: 0.15 });                           // Wusch, Donner, Welle
```

## 8. Film

```js
FS.rig.manual();
FS.film.card('Titel', 'Unterzeile', { dur: 3.5, cam: {...} });      // Texttafel
FS.film.shot({
  dur: 7,                                                            // Sekunden
  cam: { from: { pos: [0, 1, 12], look: [0, 0, 0], fov: 50 }, to: { pos: [0, 0.5, 4], look: [0, 0, 0], fov: 42 }, ease: 'out' },
  caption: 'Ein Satz',                                               // oder [[start, 'Text', ende], ...] mit Anteilen 0 bis 1
  group: gruppe,                                                     // optional: nur in dieser Einstellung sichtbar
  fade: 0.6,                                                         // Auf- und Abblende in Sekunden, 0 = harter Schnitt
  enter() { ... }, update(p, sek, dt) { ... }, exit() { ... }        // p läuft von 0 bis 1
});
```

`FS.film.i` ist die laufende Einstellung, `FS.film.done` wird am Ende wahr, `FS.film.total` ist die Gesamtdauer. Der Film startet mit dem Startknopf, am Ende erscheint „Nochmal ansehen“.

Schreibe `update(p)` so, dass der Zustand allein aus `p` folgt (Position = Funktion von p). Dann stimmt das Bild auch beim Wiederholen.

## 9. Zeitreise

```js
const RS = FS.reise; RS.dwell = 7; RS.travel = 3.4;                 // Sekunden pro Station und für die Fahrt
RS.epoch({
  year: -10000,                       // Jahr, vor Christus negativ
  display: 'vor 12.000 Jahren',       // große Anzeige, wenn die Station erreicht ist (optional)
  label: '12.000',                    // Kurzform an der Zeitachse (optional)
  title: 'Titel', text: 'Ein bis zwei Sätze.',
  tint: '#1c1407',                    // Nebel- und Hintergrundfarbe dieser Station, wird überblendet
  prognose: true,                     // zeigt das Schild „Prognose“ (nur für Zukunft)
  build(g, e) { ... },                // Aufbau. g = Gruppe der Station, Mittelpunkt bei 0,0,0. e = die Station selbst, zum Merken von Objekten
  update(dt, t, naehe) { ... },       // Bewegung, this = die Station. naehe 0 bis 1
  enter() { ... }                     // wenn die Station erreicht ist
});
```

Die Stationen stehen im Abstand `RS.spacing` (70) hintereinander. Die Kamera schaut aus etwa 16 Metern auf den Mittelpunkt. Baue jede Station als Insel mit rund 13 Metern Radius, das Wichtigste nahe der Mitte und 1 bis 8 Meter hoch. `RS.pos` ist die aktuelle Position als Kommazahl (2.5 = zwischen Station 2 und 3). Im Querformat rückt das Gerüst die Szene nach rechts, damit links Platz für den Text ist.

## 10. Fallen in three.js r128

Diese Dinge führen am häufigsten zu einer roten Fehlermeldung oder einem schwarzen Bild:

- **Gibt es nicht:** `THREE.CapsuleGeometry` (nimm Zylinder plus Kugel), `OrbitControls`, `EffectComposer`, alle Loader, `THREE.ColorManagement`, `texture.colorSpace` (hier heißt es `texture.encoding = THREE.sRGBEncoding`, `FS.canvasTex` setzt das schon).
- **Geometrien** heißen `BoxGeometry`, `PlaneGeometry`, `SphereGeometry`, `CylinderGeometry`, `ConeGeometry`, `TorusGeometry`, `IcosahedronGeometry`, `DodecahedronGeometry`, `OctahedronGeometry`, `TetrahedronGeometry`, `RingGeometry`, `CircleGeometry`, `TubeGeometry`, `LatheGeometry`, `ExtrudeGeometry`, `EdgesGeometry`.
- **Eigene Geometrie:** `new THREE.BufferGeometry()` und `geo.setAttribute('position', new THREE.Float32BufferAttribute(liste, 3))`. `THREE.Geometry` gibt es nicht mehr.
- **Linien** sind immer 1 Pixel breit. Für dicke Linien dünne Boxen oder Zylinder nehmen.
- **Eigene Shader** bekommen keinen Nebel von selbst. Entweder selbst einrechnen (siehe Holo-Tafel in `beispiele/welt-tokio.js`) oder nur für Himmel und Fernes verwenden.
- **Durchsichtiges:** `transparent: true` und `depthWrite: false` setzen, sonst entstehen Löcher.
- **Lichter:** Höchstens vier bis fünf. Lichter nicht ein- und ausblenden, indem man sie aus der Szene nimmt, sondern über `intensity`. Sonst ruckelt es.
- **Schatten** sind abgeschaltet und sollen es bleiben. Sie kosten viel und der Look lebt vom Leuchten.
- **Größe von `FS.glows`** folgt der Skalierung der Gruppe, in der sie liegen. Eine Gruppe auf Skalierung 0 blendet auch ihre Lichtpunkte aus.
- **Reihenfolge:** `const` und `let` erst nach ihrer Zeile benutzbar. Helfer, die du oben brauchst, als `function name() {}` schreiben.
- **Kein `</script>`** in Texten oder Kommentaren der Szene.
