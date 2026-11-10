# Ton: Musik und Geräusche

Alles entsteht im Browser, ohne Dateien. Aufbau immer in `FS.onStart`, erste Zeile `if (!FS.audio.ctx) return;`.

## Lautstärken, die zusammenpassen

| Baustein | `gain` |
|---|---|
| Geräuschkulisse (Rauschen) | 0.08 bis 0.3 |
| Fläche (`pad`) | 0.04 bis 0.06 |
| Bass | 0.18 bis 0.24 |
| Melodie, Tonfolge | 0.04 bis 0.09 |
| Kick | 0.3 bis 0.5 |
| Snare, Hi-Hat | 0.03 bis 0.1 |

Lieber zu leise als zu laut. Die Musik soll die Stimmung tragen, nicht auffallen.

## Geräuschkulissen

```js
A.noise({ color: 'pink',  type: 'bandpass', freq: 2600, q: 0.35, gain: 0.17 });   // Regen
A.noise({ color: 'brown', type: 'lowpass',  freq: 170,  gain: 0.3 });             // Stadt, Maschinenraum, Tiefe
A.noise({ color: 'pink',  type: 'lowpass',  freq: 500,  gain: 0.2 });             // Wind
A.noise({ color: 'white', type: 'highpass', freq: 6500, gain: 0.02 });            // Zischen, Grillen
```

Meer: Wind-Rauschen nehmen und die Lautstärke langsam schwanken lassen, in `FS.onUpdate`: `n.gain.value = 0.12 + Math.sin(t * 0.5) * 0.08`.

## Tonhöhen

Zahlen wie auf dem Klavier: 60 ist das mittlere C, plus 12 ist eine Oktave höher. Akkorde, die immer gut klingen:

| Stimmung | Folge |
|---|---|
| melancholisch, nächtlich | Dm7 `[50,57,60,65]` → B `[46,53,58,62]` → F `[41,48,57,60]` → C `[48,55,59,64]` |
| hoffnungsvoll, weit | C `[48,55,60,64]` → Am `[45,52,57,60]` → F `[41,48,57,60]` → G `[43,50,55,59]` |
| geheimnisvoll | Am `[45,52,57,60]` → F `[41,48,53,57]` → Dm `[38,45,50,53]` → E `[40,47,52,56]` |
| episch | Dm `[38,45,50,53]` → B `[34,41,46,50]` → C `[36,43,48,52]` → Dm |

Melodietöne aus der Fünftonleiter passen über alle diese Folgen: `[62, 65, 67, 69, 72, 74, 77]`.

## Ein Stück aufbauen

```js
const chords = [[50,57,60,65],[46,53,58,62],[41,48,57,60],[48,55,59,64]];
const scale = [62, 65, 67, 69, 72, 74, 77];
const pad = A.pad(chords[0], { gain: 0.05, cutoff: 750, reverb: 0.7 });
A.loop({ bpm: 84, div: 4, fn(i, time, sd) {            // div 4 = sechzehn Schritte pro Takt
  const bar = Math.floor(i / 16) % 4, s = i % 16, root = chords[bar][0] - 12;
  if (s === 0) pad.to(chords[bar], 1.5);                // Akkordwechsel am Taktanfang
  if (s === 0 || s === 10) A.kick(time, 0.42);
  if (s === 4 || s === 12) A.snare(time, 0.1);
  if (s % 2 === 0) A.hat(time, 0.04);
  if ([0, 3, 6, 10, 13].includes(s)) A.tone(root, { time, dur: sd * 1.6, gain: 0.2, cutoff: 420, sweep: 160 });   // Bass
  if ((i * 7) % 5 < 2) A.tone(scale[(i * 5) % scale.length], { time, wave: 'triangle', dur: sd * 0.8, gain: 0.055, reverb: 0.8, release: 0.5 });
} });
```

Im Taktgeber immer den Wert `time` an die Töne weitergeben, sonst wackelt der Rhythmus.

## Tempo und Charakter

| Stimmung | bpm | Mittel |
|---|---|---|
| ruhig, weit, Natur | 60 bis 72 | nur Fläche, einzelne Sinustöne mit viel Hall, kein Schlagzeug |
| nächtlich, Stadt, Synth | 80 bis 92 | Sägezahn-Bass mit Filterfahrt, leichte Drums, Dreieck-Tonfolge |
| treibend, Technik | 110 bis 126 | Kick auf jedem Schlag, Hi-Hat dazwischen, kurze Basstöne |
| feierlich, Film | 66 bis 76 | Akkorde mit langsamem Einsatz (`attack` 0.4), tiefer Sinusbass |

## Klangfarben für `A.tone`

- `wave: 'sine'` mit `reverb: 0.9`, `release: 1.5`: Glocke, Tropfen, einzelner klarer Ton
- `wave: 'triangle'`: weiche Melodie
- `wave: 'sawtooth'` mit `cutoff: 400` und `sweep: 150`: Synth-Bass
- `wave: 'square'` mit `dur: 0.02`: Klick, Funke

## Geräusche zu Ereignissen

```js
A.whoosh({ color: 'brown', type: 'lowpass', from: 900, to: 70, dur: 3.2, attack: 0.03, gain: 0.9, reverb: 0.6 });   // Donner
A.whoosh({ from: 200, to: 2400, dur: 2.2, gain: 0.14, reverb: 0.7 });                                              // Übergang, Verwandlung
A.tone(84, { wave: 'sine', dur: 1, gain: 0.15, reverb: 0.9, release: 1.5 });                                        // Erscheinen
A.tone(48, { wave: 'sine', dur: 0.3, slide: -24, gain: 0.4 });                                                      // Aufprall
```

Jede sichtbare Reaktion auf Antippen bekommt ein Geräusch. Bild und Ton zusammen wirken stärker als jedes für sich.
