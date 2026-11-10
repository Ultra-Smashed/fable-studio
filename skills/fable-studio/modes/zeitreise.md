# Modus Zeitreise

Eine Fahrt entlang einer Zeitachse: sieben bis zehn Stationen, jede eine kleine 3D-Szene mit Jahr, Titel und ein bis zwei Sätzen. Läuft von selbst, lässt sich über die Achse steuern. Vorlage: `assets/szene-zeitreise.js`. Messlatte: `beispiele/zeitreise-menschheit.js`.

## Erst die Fakten

Hier stehen Jahreszahlen und Behauptungen auf dem Bildschirm. Sie müssen stimmen.

- Wenn du im Netz suchen kannst, prüfe jede Station: Jahr, Ort, Name.
- Wenn nicht, nimm nur Stationen, bei denen du sicher bist, und runde ehrlich („vor rund 300.000 Jahren“ statt einer Scheingenauigkeit).
- Bei umstrittenen Datierungen die vorsichtige Formulierung wählen („die ältesten bekannten…“, „Spuren von…“).
- **Zukunft ist immer Prognose.** Setze `prognose: true` und schreibe im Text offen, dass es ein Szenario ist, keine Tatsache. Höchstens ein bis zwei Zukunftsstationen, und sie sollen aus der Entwicklung davor folgen.

## Stationen auswählen

- Sieben bis zehn. Weniger wirkt dünn, mehr ermüdet.
- Jede Station ist ein Wendepunkt, nach dem etwas grundsätzlich anders war. Der Text nennt in einem Satz, was geschah, und im zweiten, was es veränderte.
- Der Abstand zwischen den Stationen darf stark schrumpfen (Millionen Jahre, dann Jahrzehnte). Das ist oft die eigentliche Aussage: Es wird schneller.
- Ein roter Faden: Die letzte Station beantwortet eine Frage, die die erste stellt.

## Jahresangaben

| Zeit | `year` | `display` | `label` |
|---|---|---|---|
| weit zurück | -3300000 | 'vor 3,3 Mio. Jahren' | '3,3 Mio.' |
| Vorgeschichte | -10000 | 'vor 12.000 Jahren' | '12.000' |
| Antike | -3300 | '3300 v. Chr.' | '3300 v. Chr.' |
| ab dem Jahr 1 | 1450 | (nicht nötig) | '1450' |

Während der Fahrt zählt die Anzeige von selbst zwischen den Jahren.

## Jede Station als kleine Bühne

- Insel mit etwa 13 Metern Radius, Mittelpunkt bei 0,0,0. Die Kamera steht bei etwa z = 16 und schaut auf 2 bis 3 Meter Höhe.
- **Ein Motiv pro Station**, sofort erkennbar: Feuer, Tafel mit Zeichen, Druckpresse, Mondfähre. Aus einfachen Körpern gebaut, nicht detailverliebt. Erkennbarkeit schlägt Genauigkeit.
- **Etwas bewegt sich** in jeder Station: Flammen, fliegende Seiten, pulsierende Knoten.
- **Eigene Farbstimmung** über `tint` und die Farbe des Hauptlichts. Die Abfolge der Stimmungen erzählt mit: von warm und dunkel zu kühl und hell, oder umgekehrt.
- Menschen als einfache Figuren (Zylinder plus Kugel) geben Maßstab.
- Nichts in die vordersten 4 Meter stellen (z größer als 10), dort steht die Kamera.
- Leuchtende Himmelskörper und Sterne weit nach hinten (z kleiner als -12).

Ein Hauptlicht (`PointLight`), das mit `RS.pos` mitfährt und pro Station die Farbe wechselt, reicht für alle Stationen. Siehe Beispiel.

## Ton

Ein liegender Akkord, der pro Station wechselt und über die Reise heller und höher wird. Beim Stationswechsel ein Wusch und ein einzelner Ton. In späteren Stationen kommt Bewegung dazu (Tonfolgen), so hört man die Beschleunigung. Stationsgeräusche (Feuerknistern, Funken) nur leise und nur, wenn `naehe` nahe 1 ist.
