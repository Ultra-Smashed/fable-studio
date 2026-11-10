# Rezepte für das Bild

Alle Rezepte nutzen die Bausteine aus `engine.md`.

## Licht, das modelliert
Ein `HemisphereLight` (Stärke 0.5 bis 1.1) als Grundlicht, dazu zwei `DirectionalLight` in zwei Leitfarben aus gegenüberliegenden Richtungen (Stärke je 0.4 bis 0.6). So bekommt jeder Körper eine warme und eine kühle Seite. Die eigentliche Helligkeit kommt von leuchtenden Flächen, nicht vom Licht.

## Neon
Dünne Box oder Schriftfläche mit `MeshBasicMaterial` und `FS.col(farbe, 3)`. Dazu ein großer, schwacher Lichtpunkt davor (`size` 12 bis 30, `k` 0.1 bis 0.2), der die Luft färbt. Flackern: Farbe pro Bild mit einem Zufallswert unter 1 multiplizieren, aber nur bei wenigen Schildern.

## Nebel und Luft
`fog` in `FS.setup` plus 20 bis 40 große, sehr schwache Lichtpunkte (`size` 10 bis 20, `k` 0.05 bis 0.1) in Bodennähe, die langsam aufsteigen oder treiben. Das wirkt wie Dampf oder Dunst im Gegenlicht.

## Nasser Boden und Wasser
Spiegelgruppe plus halbtransparenter dunkler Boden (siehe `engine.md`). Für Pfützen eine `alphaMap` mit helleren und dunkleren Flecken malen: dunkle Flecken spiegeln stärker. Für Wasser die Deckkraft auf 0.7 senken und das Spiegelbild leicht in y stauchen (`scale.y = -0.9`).

## Regen und Schnee
Regen: 1500 kurze Linien (`LineSegments`) in einem Kasten, der der Kamera folgt; jede fällt mit eigener Geschwindigkeit und springt oben wieder ein. Schnee: `FS.glows` mit 600 kleinen Punkten, langsam fallend mit Sinus-Drift.

## Sterne und Milchstraße
`FS.glows` mit `fog: 0`, 300 bis 500 Punkte, Größe 0.3 bis 0.9, weit hinten. Für die Milchstraße ein schräges Band aus 250 dichter gesetzten Punkten in leicht wechselnden Farbtönen.

## Feuer
40 bis 50 Lichtpunkte, die aufsteigen und dabei zur Mitte zusammenlaufen, Farben von Rot über Orange zu Gelb, `k` um 0.4 (viele überlagern sich). Ein warmes `PointLight` an derselben Stelle, dessen Stärke leicht zittert.

## Sonne, Mond, Planeten
Kugel mit `MeshBasicMaterial` und `k` 2 bis 2.5, dahinter ein riesiger Lichtpunkt (`size` 50 bis 60, `k` 0.3). Planeten mit Licht- und Schattenseite: `MeshLambertMaterial` und ein `DirectionalLight`.

## Hologramm und Bildschirm
Fläche mit eigenem Shader: Rasterzellen, die an- und ausgehen, Zeilenmuster, ein wandernder Lichtbalken. Vorlage in `beispiele/welt-tokio.js` (`holoMat`), mit eingerechnetem Nebel.

## Gelände
`PlaneGeometry` mit 100 mal 100 Unterteilungen, Höhen über eine Summe von Sinuswellen setzen (`geo.attributes.position.setZ`), danach `geo.computeVertexNormals()`. Mit `flatShading: true` entsteht ein kantiger, grafischer Look, der wenig Details braucht.

## Bäume und Pflanzen
Stamm als dünner Zylinder, Krone als zwei bis drei gestauchte Kugeln oder Kegel. Alles über `FS.inst`, mit zufälliger Größe und Farbton. Gras und Getreide: hunderte sehr dünne Kegel.

## Figuren
Zylinder plus Kugel, dunkel, als Silhouette. Sie geben Maßstab und Leben. Ein leuchtendes Detail (Schirm, Bildschirm, Fackel) macht sie interessant.

## Wireframe und Linienkunst
`new THREE.EdgesGeometry(geometrie)` mit `LineSegments` und leuchtender Farbe ergibt Kantenmodelle. Gut für Technik, Mathematik, Zukunft.
