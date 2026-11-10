#!/usr/bin/env node
/* Öffnet die fertige Seite in einem unsichtbaren Browser, startet sie, meldet Fehler und speichert Bilder.
   Braucht Playwright (npm i playwright && npx playwright install chromium).

   Aufruf:  node scripts/pruefen.js ausgabe.html [bildordner]
   Ohne Internet: THREE_LOKAL=/pfad/zu/three.min.js davor setzen (Version r128).
   Eigener Browser: CHROME_PFAD=/pfad/zu/chrome davor setzen. */
const path = require('path'), fs = require('fs');
(async () => {
  const [file, outDir = '.'] = process.argv.slice(2);
  if (!file) { console.log('Aufruf: node scripts/pruefen.js ausgabe.html [bildordner]'); process.exit(1); }
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('Playwright ist nicht installiert. Prüfung übersprungen. Lies den Code stattdessen noch einmal gegen die Liste in SKILL.md.'); process.exit(0); }
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PFAD || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const errors = [];
  for (const [name, w, h] of [['quer', 1280, 720], ['hoch', 450, 800]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    page.on('pageerror', (e) => errors.push(name + ': ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(name + ': ' + m.text()); });
    if (process.env.THREE_LOKAL) await page.route('**/three.min.js', (r) => r.fulfill({ path: process.env.THREE_LOKAL, contentType: 'application/javascript' }));
    await page.goto('file://' + path.resolve(file));
    await page.waitForTimeout(1500);
    await page.click('#sBtn').catch(() => errors.push(name + ': Startknopf nicht gefunden'));
    await page.waitForTimeout(5000);
    const shown = await page.evaluate(() => document.getElementById('err').textContent);
    if (shown) errors.push(name + ': ' + shown.split('\n')[0]);
    const info = await page.evaluate(() => (window.FS ? { film: FS.film.shots.length, stationen: FS.reise.eps.length } : null));
    const shot = path.join(outDir, 'pruefung-' + name + '.png');
    await page.screenshot({ path: shot });
    console.log(name + ': Bild gespeichert unter ' + shot + (info ? ' · ' + JSON.stringify(info) : ''));
    await page.close();
  }
  await browser.close();
  if (errors.length) { console.log('\nFEHLER:\n' + [...new Set(errors)].join('\n')); process.exit(2); }
  console.log('\nKeine Fehler. Sieh dir jetzt die beiden Bilder an: Ist die Szene sichtbar, lesbar und nicht leer?');
})();
