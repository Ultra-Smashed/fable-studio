---
name: fable-studio
description: Baut aus einem einzigen Satz ein fertiges, beeindruckendes 3D-Erlebnis als eine HTML-Datei, mit Licht, Kamerafahrt, Bewegung und eigenem Ton. Drei Modi. Welt (interaktive 3D-Szene, z. B. „Cyberpunk-Straße in Tokio“), Film (animierter Kurzfilm mit Untertiteln und Musik) und Zeitreise (animierte Zeitleiste von früher bis in die Zukunft). Benutze diesen Skill immer, wenn jemand eine 3D-Szene, eine 3D-Welt, eine interaktive Szene, einen animierten Kurzfilm, eine Animation, eine Zeitreise, eine Zeitleiste zum Durchfahren, eine Visualisierung der Geschichte von etwas oder „etwas Beeindruckendes zum Zeigen oder Posten“ möchte, auch wenn das Wort 3D nicht fällt und auch bei „build an interactive 3D scene“, „make a short film about“, „visualize the history of“.
---

# Fable Studio

Aus einem Satz wird ein fertiges Stück: eine einzige HTML-Datei, die sofort läuft, gut aussieht, klingt und sich für eine Bildschirmaufnahme im Hochformat eignet.

Der Skill nimmt dir die fehleranfälligen Teile ab. `assets/starter.html` enthält ein geprüftes Grundgerüst (Darstellung mit Leuchteffekt, Kamera, Ton, Startbildschirm, Aufnahme-Modus, Film- und Zeitreise-Steuerung). Du schreibst nur die Szene, also den Inhalt. Dadurch bleibt deine ganze Aufmerksamkeit bei Gestaltung und Geschichte.

## Ablauf

### 1. Modus wählen

| Modus | Wann | Anleitung | Vorlage | Beispiel |
|---|---|---|---|---|
| **Welt** | Ein Ort, ein Objekt, eine Stimmung zum Umsehen. „Baue…“, „Szene“, „Welt“, „Straße“, „Landschaft“ | `modes/welt.md` | `assets/szene-welt.js` | `beispiele/welt-tokio.js` |
| **Film** | Eine Geschichte mit Anfang und Ende. „Kurzfilm“, „Animation über…“, „erzähle“, „Selbstporträt“ | `modes/film.md` | `assets/szene-film.js` | `beispiele/film-punkt.js` |
| **Zeitreise** | Eine Entwicklung über die Zeit. „Geschichte von…“, „Evolution“, „von X bis heute“, „die nächsten 30 Jahre“ | `modes/zeitreise.md` | `assets/szene-zeitreise.js` | `beispiele/zeitreise-menschheit.js` |

Ist es unklar, nimm **Welt**. Frag nicht nach. Der Wert dieses Skills liegt darin, dass ein Satz reicht.

### 2. Lesen

Lies in dieser Reihenfolge, und nur das:
1. `references/engine.md` (alle Bausteine des Grundgerüsts und die Fallen der Bibliothek)
2. die Anleitung deines Modus
3. das Beispiel deines Modus. Es zeigt die Messlatte für Dichte und Sorgfalt. Übernimm die Arbeitsweise, nicht das Motiv.

Bei Bedarf: `references/visuals.md` (Rezepte für Licht, Nebel, Neon, Wasser, Partikel), `references/audio.md` (Musik und Geräusche), `references/styles.md` (fertige Looks), `references/performance.md` (flüssig auf dem Handy).

### 3. Den Satz zu einem Entwurf ausarbeiten

Der Mensch schreibt einen Satz. Die Qualität entsteht daraus, dass du ihn selbst zu einem vollständigen Entwurf machst, bevor du Code schreibst. Leg im Kopf fest:

- **Kernbild:** Welches eine Bild soll hängen bleiben? Alles andere dient ihm.
- **Stimmung und Palette:** zwei bis drei Leitfarben plus eine dunkle Grundfarbe. Wenige Farben wirken hochwertiger als viele.
- **Licht:** Woher kommt es? Was leuchtet selbst?
- **Tiefe:** Vordergrund, Mitte, Hintergrund. Nebel und Größenstaffelung.
- **Bewegung:** mindestens drei Ebenen, die sich unabhängig bewegen (zum Beispiel Regen, Verkehr, Schilder).
- **Kamera:** eine Fahrt mit Absicht, kein zufälliges Kreisen.
- **Ton:** eine Geräuschkulisse plus Musik, die zur Stimmung passt.
- **Interaktion oder Dramaturgie:** Was passiert beim Tippen (Welt), wie verläuft der Bogen (Film), welche Stationen (Zeitreise)?

Diesen Entwurf zeigst du nicht vorab. Du baust ihn.

### 4. Bauen

Schreibe nur die Szene in eine Datei `szene.js`, ausgehend von der Vorlage deines Modus. Dann:

```bash
python3 scripts/bauen.py szene.js <name>.html
```

Das Skript setzt die Szene ins Grundgerüst ein, prüft die Syntax und warnt vor Dingen, die es hier nicht gibt. Das Grundgerüst selbst veränderst du nie. Wenn dir etwas fehlt, baue es in der Szene.

Falls du keine Befehle ausführen kannst: Gib `assets/starter.html` vollständig und unverändert aus und ersetze nur den Platzhalter `/*__SCENE__*/` durch deine Szene.

Feste Regeln, weil das Ergebnis überall laufen muss (auch als Artifact in der Claude-App):
- Eine Datei. Keine Bilder, Schriften, Modelle oder Sounds von außen. Alles entsteht im Code.
- Einzige Bibliothek ist three.js r128, sie ist im Grundgerüst schon geladen. Zusatzmodule wie OrbitControls, EffectComposer oder Loader gibt es nicht. Kamera und Leuchteffekt liefert das Grundgerüst.
- Kein `localStorage`, kein `import`, kein zweites `<script>`.
- Texte auf dem Bildschirm in der Sprache des Menschen.

### 5. Qualitätslatte

Bevor du abgibst, geh diese Liste durch. Jeder Punkt hat einen Grund: Ohne ihn wirkt das Ergebnis wie eine Technik-Demo statt wie ein fertiges Stück.

- [ ] **Sofort ein Bild:** Schon hinter dem Startbildschirm ist die Szene zu sehen. Nichts ist schwarz oder leer.
- [ ] **Tiefe:** Nebel ist gesetzt, es gibt nahe und ferne Dinge.
- [ ] **Leuchten mit Maß:** Einige wenige Flächen leuchten stark (Helligkeit 2 bis 4), der Rest bleibt dunkel. Wenn alles leuchtet, leuchtet nichts.
- [ ] **Drei bewegte Ebenen** plus Kamerabewegung.
- [ ] **Dichte:** Die Szene besteht aus hunderten Teilen (über `FS.inst`), kein leerer Raum mit fünf Würfeln.
- [ ] **Ton:** Geräuschkulisse und Musik starten mit dem Startknopf, leise genug, um angenehm zu sein.
- [ ] **Hochformat:** Das Kernbild liegt in der Bildmitte und funktioniert auch in 9:16.
- [ ] **Titel, Unterzeile und Bedienhinweis** sind über `FS.setup` gesetzt.
- [ ] **Fakten** (nur Zeitreise und Sachfilme): Jede Zahl und jedes Datum stimmt. Prognosen sind als Prognose markiert.

### 6. Prüfen

Wenn du Befehle ausführen kannst, teste wirklich:

```bash
node scripts/pruefen.js <name>.html
```

Das startet die Seite in einem unsichtbaren Browser im Quer- und Hochformat, meldet Fehler und speichert zwei Bilder. Sieh dir die Bilder an und bessere nach, bis kein Fehler mehr kommt und das Bild der Qualitätslatte entspricht. Ist kein Browser verfügbar, lies deine Szene noch einmal Zeile für Zeile gegen den Abschnitt „Fallen“ in `references/engine.md`. Die häufigsten Fehler sind Tippfehler in Variablennamen und Funktionen, die es in three.js r128 nicht gibt.

### 7. Abgeben

- In der Claude-App: als HTML-Artifact, damit es sofort läuft und geteilt werden kann.
- In Claude Code: als Datei im Projektordner, mit dem Hinweis, sie im Browser zu öffnen.

Die Antwort dazu ist kurz: ein Satz, was entstanden ist, die Bedienung (Ziehen, Scrollen, Tippen, Taste R oder Knopf „9:16“ für den Aufnahme-Modus) und drei Vorschläge für Varianten, jeder ein Satz, den der Mensch einfach zurückschicken kann.

Zeigt die Seite später eine rote Fehlermeldung, schickt der Mensch sie dir. Behebe die Ursache in der Szene und baue neu.

## Aufnahme-Modus

Der Knopf „9:16“ oder die Taste R schaltet auf Hochformat ohne Bedienelemente. Welt fährt dann von selbst, Film und Zeitreise beginnen von vorn. So entsteht mit einer Bildschirmaufnahme direkt ein Video für Reels, TikTok oder Shorts. Erwähne das in deiner Antwort, es ist für viele der eigentliche Zweck.
