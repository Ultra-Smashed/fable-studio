# Flüssig auf dem Handy

Das Ergebnis wird oft auf dem Handy geöffnet und im Hochformat aufgenommen. Das Grundgerüst senkt die Auflösung selbst, wenn es ruckelt. Den Rest entscheidet die Szene.

## Richtwerte

| Was | Obergrenze |
|---|---|
| Zeichenaufrufe (einzelne Meshes) | etwa 300 |
| Dreiecke | etwa 500.000 |
| Lichter | 4 bis 5 |
| Lichtpunkte in einem `FS.glows` | einige tausend |
| Teile, die pro Bild neu berechnet werden | etwa 5.000 |

## Regeln

- **Gleiche Körper zusammenfassen.** 500 Fenster sind ein `FS.inst`, nicht 500 Meshes. Das ist der größte Hebel.
- **Geometrien und Materialien teilen.** Eine Box-Geometrie für alle Boxen, über `scale` anpassen.
- **Kugeln und Zylinder grob halten:** 12 bis 20 Segmente reichen. Nur das eine Objekt im Mittelpunkt bekommt mehr.
- **Texturen klein:** 128 bis 512 Pixel. Schrifttexturen entstehen einmal und werden wiederverwendet.
- **Kein Objekt pro Bild erzeugen.** Kein `new THREE.Vector3()` in `FS.onUpdate` für jedes Teilchen; einen Platzhalter anlegen und wiederverwenden.
- **Große durchsichtige Flächen sparsam.** Jede zusätzliche Schicht kostet auf dem Handy spürbar.
- **Keine Schatten, keine zusätzlichen Renderdurchgänge.** Spiegelungen über `FS.mirror`, nicht über ein zweites Rendern.
- **Fernes vereinfachen.** Die hintere Gebäudereihe bekommt weniger Fenster und keine Details.

## Hochformat

Im Hochformat ist das Bild schmal. Das Kernmotiv gehört in die Mitte, wichtige Dinge nicht an den linken oder rechten Rand. `FS.portrait` sagt, ob das Bild hochkant ist, falls die Kamera einen anderen Abstand braucht.
