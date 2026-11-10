# Modus Welt

Eine interaktive 3D-Szene: ein Ort, den man sich ansieht, durch den man fährt oder um den man kreist. Vorlage: `assets/szene-welt.js`. Messlatte: `beispiele/welt-tokio.js`.

## Aufbau in dieser Reihenfolge

1. **`FS.setup`**: Titel, Nebel, Hintergrund, Nachbearbeitung.
2. **Licht und Himmel**: ein Grundlicht, ein bis zwei farbige Richtungslichter aus gegenüberliegenden Seiten (das modelliert Körper), `FS.sky`.
3. **Die große Form**: Was füllt das Bild? Gebäudereihen, Gelände, ein zentrales Objekt. Mit `FS.inst`, hundert bis tausend Teile.
4. **Lichtquellen**: Fenster, Schilder, Lampen, Sonne. Wenige stark, viele schwach. Dazu `FS.glows` als Lichtschein in der Luft.
5. **Details auf Augenhöhe**: Das, woran die Kamera nah vorbeikommt, entscheidet über den Eindruck. Schilder mit Schrift, Geländer, Kabel, Figuren.
6. **Boden**: fast immer spiegelnd oder zumindest strukturiert. Ein nackter, einfarbiger Boden verrät die Szene sofort als Demo.
7. **Bewegung**: Wetter (Regen, Schnee, Staub), Verkehr oder Lebewesen, flackernde oder wandernde Lichter.
8. **Kamera**: siehe unten.
9. **Interaktion**: Antippen löst etwas Sichtbares und Hörbares aus.
10. **Ton**: Geräuschkulisse plus Musik.

## Welche Kamera

| Motiv | Kamera |
|---|---|
| Straße, Tunnel, Fluss, Schlucht, Korridor | `FS.rig.cruise` als endlose Fahrt (Welt wiederholt sich, siehe unten) |
| Stadt, Landschaft, Dorf, Insel | `FS.rig.path` als Rundflug über 5 bis 8 Punkte, Höhe wechselnd |
| Ein Objekt, ein Planet, eine Figur, ein Raum | `FS.rig.orbit` |

Bei einem Rundflug die Punkte so legen, dass die Kamera die meiste Zeit auf das Kernmotiv zufliegt oder es umrundet. Sie schaut immer in Fahrtrichtung; führt die Bahn vom Motiv weg, zeigt das Bild leeren Himmel.

Eine gute Fahrt wechselt die Höhe: tief über dem Boden wirkt schnell und nah, ein Anstieg zeigt die Weite. Lass die Kamera nie durch Körper fahren. Lege Fahrspuren von Fahrzeugen neben die Kamerabahn, nicht darauf.

## Endlose Welt

Für Fahrten geradeaus: Baue einen Block der Länge L (etwa 160 Meter) als Gruppe, stelle ihn dreimal hintereinander (`clone(true)`, versetzt um L) und lass die Kamera mit `-(d % L)` durch den mittleren fahren. Der Nebel verdeckt das Ende. Bewegte Dinge (Autos, Menschen, Regen) rechnet man relativ zur Kamera und wickelt sie um. Das vollständige Muster steht in `beispiele/welt-tokio.js`.

## Interaktion

Mindestens eine Reaktion auf Antippen, die zur Welt passt und Bild und Ton verbindet: Blitz und Donner, ein Lichtimpuls, ein Schwarm fliegt auf, Farbwechsel, eine Welle. Kurz ansteigen lassen und über ein bis zwei Sekunden abklingen. Trage sie in `hint` ein, sonst findet sie niemand.

## Häufige Schwächen

- **Zu hell, zu bunt:** Dunkle Grundfarbe, zwei bis drei Leuchtfarben. Große Flächen dunkel lassen.
- **Zu leer:** Mehr Wiederholung über `FS.inst`, mehr kleine Lichtpunkte, eine zweite Reihe im Hintergrund.
- **Flach:** Nebel erhöhen, Lichtschein in die Luft setzen, Größen staffeln.
- **Steril:** Unregelmäßigkeit über `FS.rand` (Höhen, Abstände, Farbtöne, einige Lichter aus).
