# Fertige Looks

Jeder Look ist ein Satz von Einstellungen für `FS.setup` plus Hinweise. Nimm den, der zum Satz des Menschen passt, oder mische zwei. Nennt der Mensch keinen Stil, wähle den, der das Kernbild am stärksten macht.

Faustregel für Nebel: Dunkler Nebel verträgt Dichten von 0.01 bis 0.03. Heller Nebel (Tag, Sonnenuntergang, Wüste) wäscht das Bild schnell aus, dort bei 0.004 bis 0.007 bleiben.

## Neon-Nacht (Cyberpunk, Stadt, Zukunft)
```js
background: '#04030a', fog: ['#0c0720', 0.0105], post: { bloom: 1.2, vignette: 0.5, aberration: 0.004, grain: 0.05 }
```
Leitfarben Magenta `#ff2bd6`, Cyan `#00e5ff`, Gelb `#ffd400`. Nasser Boden, Regen, Schrift auf Schildern, Lichtschein in der Luft. Musik: 84 bpm, Synth-Bass.

## Goldene Stunde (Natur, Landschaft, Ruhe)
```js
background: '#e8935a', fog: ['#e8935a', 0.0055], post: { bloom: 0.9, vignette: 0.35, aberration: 0.002, grain: 0.03, saturation: 1.1 }
```
Himmel `FS.sky('#2a3f7a', '#ff9a5a', '#e8935a')`. Tiefe Sonne, lange Silhouetten, warme Kanten. Körper in gedeckten Tönen, die Sonne leuchtet. Musik: 66 bpm, nur Fläche und einzelne Töne.

## Low-Poly (freundlich, verspielt, Spielzeugwelt)
```js
background: '#8cc4f5', fog: ['#8cc4f5', 0.005], post: { bloom: 0.5, vignette: 0.2, aberration: 0, grain: 0.015, saturation: 1.15 }
```
`MeshLambertMaterial` mit `flatShading: true`, klare Farben, starkes weißes Richtungslicht plus helles Grundlicht. Wenig Leuchten. Musik: 96 bpm, Dreieck-Melodie, hell.

## Weltraum (Kosmos, Wissenschaft, Größe)
```js
background: '#01020a', fog: ['#01020a', 0.002], post: { bloom: 1.3, vignette: 0.55, aberration: 0.003, grain: 0.04 }
```
Kaum Nebel, viele Sterne mit `fog: 0`, ein Planet oder eine Sonne als Anker. Langsames Kreisen. Musik: 60 bpm, tiefe Fläche, viel Hall.

## Lichtzeichnung (abstrakt, Mathematik, Daten, Selbstporträt)
```js
background: '#03040a', fog: ['#03040a', 0.011], post: { bloom: 1.35, vignette: 0.6, aberration: 0.003, grain: 0.05 }
```
Fast nur Lichtpunkte und Kantenmodelle auf Schwarz, ein Bodenraster als Horizont. Ein oder zwei Farben. Formen entstehen, indem Punkte sich ordnen. Musik: 72 bpm, Sinustöne.

## Aquarell-Dämmerung (märchenhaft, sanft)
```js
background: '#2a2548', fog: ['#3a3260', 0.016], post: { bloom: 1.0, vignette: 0.4, aberration: 0.002, grain: 0.06, saturation: 0.9 }
```
Himmel `FS.sky('#1a1838', '#c078a0', '#2a2548')`. Violett und Rosa, Glühwürmchen, runde Formen, warmes Fensterlicht. Musik: 70 bpm, Glockentöne.

## Unterwasser
```js
background: '#02202e', fog: ['#02283a', 0.03], post: { bloom: 1.1, vignette: 0.5, aberration: 0.006, grain: 0.03 }
```
Dichter Nebel in Blaugrün, aufsteigende Blasen als Lichtpunkte, schwankendes Licht von oben, alles bewegt sich langsam in Sinuswellen. Geräusch: tiefes braunes Rauschen.

## Wüste und Staub
```js
background: '#c98a4a', fog: ['#c98a4a', 0.006], post: { bloom: 0.8, vignette: 0.45, aberration: 0.002, grain: 0.06, saturation: 0.85 }
```
Sandtöne, harte Sonne, treibender Staub als große schwache Lichtpunkte, weite Leere mit einem Anker.
