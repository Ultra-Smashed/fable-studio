# Fable Studio

Ein Skill für Claude. Ein Satz genügt, und Claude baut ein fertiges 3D-Erlebnis als eine einzige HTML-Datei: mit Licht, Kamerafahrt, Bewegung und eigenem Ton. Kostenlos, MIT-Lizenz.

| Modus | Beispiel-Satz | Ergebnis |
| --- | --- | --- |
| Welt | „Baue eine interaktive 3D-Cyberpunk-Straße in Tokio.“ | 3D-Szene zum Umsehen, mit Reaktion auf Antippen |
| Film | „Mach einen Kurzfilm über einen einfachen Punkt.“ | animierter Kurzfilm mit Untertiteln und Musik |
| Zeitreise | „Zeig 3,3 Millionen Jahre Menschheit und die nächsten 30 Jahre.“ | Fahrt entlang einer Zeitachse mit Stationen |

Die drei Ergebnisse oben liegen fertig im Ordner [`demos/`](demos/). Herunterladen und im Browser öffnen.

## Installation

### Claude-App (Web, Desktop)

1. [`fable-studio.zip`](https://github.com/Ultra-Smashed/fable-studio/raw/main/fable-studio.zip) herunterladen.
2. In Claude unter **Settings → Capabilities** den Schalter **Code execution and file creation** einschalten. In der neueren Ansicht heißt er **Create and edit files**.
3. **Customize → Skills** öffnen, auf **+** klicken, dann **Create skill → Upload a skill** und die ZIP-Datei wählen.

Die Menünamen stehen hier so, wie Anthropic sie in der Hilfe nennt. In der deutschen Oberfläche können sie übersetzt sein.

Skills gibt es in allen Tarifen: Free, Pro, Max, Ultra, Team und Enterprise. In Team und Enterprise muss der Besitzer der Organisation Skills und Code-Ausführung erlaubt haben.

### Claude Code

Als Plugin:

```
/plugin marketplace add Ultra-Smashed/fable-studio
/plugin install fable-studio@fable-studio
```

Oder den Ordner kopieren:

```bash
git clone https://github.com/Ultra-Smashed/fable-studio.git
cp -r fable-studio/skills/fable-studio ~/.claude/skills/
```

Nur für ein Projekt: denselben Ordner nach `.claude/skills/` im Projekt kopieren. Wer den Skill schon in der Claude-App hochgeladen hat und Claude Code mit demselben Konto nutzt, hat ihn dort ab Version 2.1.273 automatisch.

In Claude Code prüft Claude das Ergebnis selbst im Browser, wenn Playwright installiert ist (`npm i -g playwright && npx playwright install chromium`). Ohne Playwright liest Claude den Code gegen eine Fehlerliste. Python 3 und Node.js braucht der Skill zum Zusammensetzen der Datei.

## Benutzen

Einfach den Satz schreiben. Claude wählt den Modus selbst.

In der fertigen Seite:

- **Ziehen:** umsehen oder drehen
- **Scrollen:** Tempo oder Zoom
- **Tippen:** eine Reaktion, je nach Szene
- **Knopf „9:16“ oder Taste R:** Aufnahme-Modus, Hochformat ohne Bedienelemente, für Bildschirmaufnahmen als Reel, TikTok oder Short. Doppeltipp oder R beendet ihn.
- **Taste M:** Ton an und aus

Zeigt die Seite eine rote Fehlermeldung, kopier sie in den Chat. Claude behebt sie.

## Wie der Skill arbeitet

Der Skill liefert ein geprüftes Grundgerüst mit (`assets/starter.html`): Darstellung mit Leuchteffekt, Kamera, Ton aus dem Browser, Startbildschirm, Aufnahme-Modus und die Steuerung für Film und Zeitreise. Claude schreibt nur noch die Szene, also den Inhalt. Dadurch geht die Arbeit in Gestaltung und Geschichte statt in Technik, und die Ergebnisse sind verlässlicher.

Die Ergebnisse brauchen keine Bilder, Modelle oder Sounds von außen. Einzige Bibliothek ist three.js (r128) von cdnjs.

## Dateien

```
skills/fable-studio/SKILL.md        Ablauf, Regeln, Qualitätslatte
skills/fable-studio/modes/          Anleitung je Modus: welt.md, film.md, zeitreise.md
skills/fable-studio/references/     Grundgerüst, Bild-Rezepte, Ton, Looks, Leistung
skills/fable-studio/assets/         starter.html (Grundgerüst) und je eine Vorlage pro Modus
skills/fable-studio/beispiele/      die Szenen der drei Demos
skills/fable-studio/scripts/        bauen.py (zusammensetzen), pruefen.js (im Browser testen)
fable-studio.zip                    derselbe Skill-Ordner als ZIP für die Claude-App
demos/                              die drei fertigen Beispiele als HTML
.claude-plugin/                     plugin.json, marketplace.json
```

Nach einer Änderung im Skill-Ordner die ZIP neu bauen: `cd skills && zip -r ../fable-studio.zip fable-studio`.

MIT-Lizenz, siehe [LICENSE](LICENSE). Von [Christopher Thanisch](https://thanisch.co).
