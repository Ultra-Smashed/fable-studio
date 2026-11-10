#!/usr/bin/env python3
"""Setzt eine Szene in das Grundgerüst ein und prüft sie auf Syntaxfehler.

Aufruf:  python3 scripts/bauen.py szene.js ausgabe.html
"""
import pathlib, shutil, subprocess, sys

def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    scene_path, out_path = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    starter = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'starter.html'
    scene = scene_path.read_text(encoding='utf-8')
    html = starter.read_text(encoding='utf-8')
    if '/*__SCENE__*/' not in html:
        sys.exit('Fehler: Platzhalter im Grundgerüst fehlt. assets/starter.html wurde verändert.')
    if '</script' in scene.lower():
        sys.exit('Fehler: Die Szene darf kein </script> enthalten.')
    if shutil.which('node'):
        r = subprocess.run(['node', '--check', str(scene_path)], capture_output=True, text=True)
        if r.returncode != 0:
            sys.exit('Syntaxfehler in der Szene:\n' + r.stderr.strip())
        print('Syntax geprüft: in Ordnung')
    else:
        print('Hinweis: node nicht gefunden, Syntax wurde nicht geprüft')
    for bad in ('OrbitControls', 'EffectComposer', 'GLTFLoader', 'CapsuleGeometry', 'colorSpace', 'localStorage', 'import '):
        if bad in scene:
            print('Warnung: "%s" in der Szene gefunden. Das gibt es hier nicht, siehe references/engine.md' % bad.strip())
    if 'FS.setup(' not in scene:
        print('Warnung: FS.setup(...) fehlt. Ohne Titel bleibt der Startbildschirm leer.')
    out_path.write_text(html.replace('/*__SCENE__*/', scene), encoding='utf-8')
    print('Geschrieben: %s (%d KB)' % (out_path, out_path.stat().st_size // 1024))

if __name__ == '__main__':
    main()
