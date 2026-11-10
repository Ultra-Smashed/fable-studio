# Modus Film

Ein selbstablaufender Kurzfilm von 40 bis 70 Sekunden, mit Titeltafel, Einstellungen, Untertiteln und Musik. Vorlage: `assets/szene-film.js`. Messlatte: `beispiele/film-punkt.js`.

Der Unterschied zur Welt: Ein Film hat eine Geschichte. Technik beeindruckt zehn Sekunden lang, eine Geschichte bleibt. Nimm dir die meiste Zeit für den Bogen.

## Erst die Geschichte

Auch aus einem trockenen Thema („ein Punkt“, „die Zahl Pi“, „Photosynthese“) wird ein Film, wenn es eine Figur gibt, die etwas will.

1. **Figur:** Wer oder was ist die Hauptfigur? Auch ein Punkt, ein Tropfen, ein Lichtstrahl kann eine sein. Gib ihr eine Eigenart in der Bewegung (hüpft, zögert, pulsiert).
2. **Wunsch oder Mangel:** Was fehlt ihr am Anfang?
3. **Wendung:** Was verändert sich in der Mitte? Hier wächst das Bild: mehr Teile, mehr Farbe, mehr Musik.
4. **Höhepunkt:** Das eine große Bild des Films. Lege es bei etwa zwei Dritteln.
5. **Schluss:** Zurück zum Anfangsbild, aber verändert. Ein letzter Satz, der den Sinn dreht.

Bei einem Selbstporträt oder einem abstrakten Thema gilt dasselbe: eine Idee, die sich entwickelt, statt einer Reihe schöner Bilder.

## Dann die Einstellungen

| Teil | Dauer | Inhalt |
|---|---|---|
| Titeltafel | 3 bis 4 s | `film.card`, ruhiges Bild dahinter |
| Anfang | 1 bis 2 Einstellungen, je 6 bis 8 s | Figur und Welt vorstellen, wenig Elemente, leise |
| Entwicklung | 2 bis 3 Einstellungen, je 7 bis 9 s | es wird mehr, die Kamera wird weiter |
| Höhepunkt | 1 Einstellung, 9 bis 11 s | das große Bild, Musik voll |
| Schluss | 1 Einstellung, 6 bis 8 s | ruhig, nah, letzter Satz |
| Endtafel | 3 bis 4 s | `film.card('Ende', ...)` |

Jede Einstellung hat eine Kamerafahrt mit Absicht: heranfahren für Nähe, zurückfahren für Größe, seitlich für Entdeckung. Aufeinanderfolgende Einstellungen wechseln Abstand oder Winkel deutlich, sonst wirkt der Schnitt wie ein Ruckler.

## Untertitel

- Höchstens zwei pro Einstellung, jeder 3 bis 4 Sekunden sichtbar.
- Kurze Sätze, höchstens neun Wörter. Sie stehen unten im Bild, also das Motiv nicht dorthin legen.
- Der Text sagt nicht, was man sieht, sondern was es bedeutet.

## Bild

Ein Film verträgt weniger Teile als eine Welt, dafür klarere Formen. Ein starkes Mittel: dieselben Teilchen ordnen sich von Einstellung zu Einstellung neu (im Beispiel 2600 Lichtpunkte, die von Sternen zu Linie, Körper und Herz werden). Dafür Zielformen als Listen vorberechnen und pro Bild zwischen zwei Formen überblenden, jedes Teilchen leicht versetzt.

Schreibe den Zustand jeder Einstellung als Funktion von `p` (0 bis 1). Setze am Anfang jedes `update` alles, was in dieser Einstellung sichtbar oder unsichtbar sein soll. Dann stimmt das Bild auch beim Wiederholen.

## Musik

Die Musik trägt die Hälfte der Wirkung. Sie wächst mit dem Bogen: am Anfang einzelne Töne mit viel Hall, in der Entwicklung eine Melodie, am Höhepunkt Bass, Akkorde und Puls, am Schluss wieder einzelne Töne. Steuere das im Taktgeber über `film.i`. Setze beim Wechsel der Einstellung einen Akzent in `enter()` (ein Ton oder ein Wusch). Rezepte in `references/audio.md`.
