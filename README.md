# MeisterFormel 📐

> **Professioneller Formel- & Lernzettel-Generator für die Meisterprüfung**  
> Gestochen scharfe mathematische Brüche (\(\frac{a}{b}\)), korrekte Malzeichen (\(\cdot\)), Wurzeln, Indizes und A4-Vektor-PDF-Export.

---

## 🚀 Schneller Start

Die Webanwendung kann auf zwei einfache Arten genutzt werden:

### Option 1: Direkt im Browser öffnen (Ohne Installation)
Doppelklicke einfach auf die Datei **`index.html`** in diesem Ordner oder öffne sie in Chrome, Edge, Firefox oder Safari.

### Option 2: Über den integrierten lokalen Webserver (Node.js)
Öffne das Terminal in diesem Verzeichnis und starte:
```bash
node serve.js
```
Öffne anschließend [http://localhost:3000](http://localhost:3000) im Browser.

---

## ✨ Hauptfunktionen

1. **Echte mathematische Formeldarstellung (KaTeX):**
   - **Bruchstriche:** Echte Brüche mit Zähler und Nenner (`\frac{a}{b}`)
   - **Multiplikation:** Korrekte Malpunkte (`\cdot`) statt Sternchen `*` (automatisches Ersetzen)
   - **Wurzeln & Potenzen:** Quadratwurzel `\sqrt{x}`, Potenzen `x^2`, Indizes `R_{ges}`
   - **Griechische Buchstaben:** `\pi`, `\Delta`, `\varphi`, `\Omega`, `\eta`, `\mu`
   - **Formelumstellungen:** Äquivalenzpfeile `\Leftrightarrow` für Umstellungen nach jeder Unbekannten

2. **Schnell-Einfügeleiste:**
   - Klicke einfach auf einen der Mathe-Buttons oben im Editor (Bruch, Mal, Wurzel, Hoch 2, Index, etc.), um den Code direkt an deiner Cursorposition einzufügen.

3. **Fertige Meister-Vorlagen (1 Klick):**
   - ⚡ **Elektrotechnik:** Ohm'sches Gesetz, Wirk-/Schein-/Blindleistung, Drehstrom (\(\sqrt{3}\)), Blindwiderstände, Spannungsfall, VDE 0100 Prüfungen
   - ⚙️ **Metall & Mechanik:** Schnittgeschwindigkeit (\(v_c\)), Drehzahl, Vorschub, Zeitspanvolumen, Zugspannung, Drehmoment
   - ♨️ **SHK / Wärmelehre:** Wärmemenge (\(Q = m \cdot c \cdot \Delta T\)), Heizwasser-Volumenstrom, Strömungsgeschwindigkeit
   - 📊 **Meister-BWL (Teil III):** Zuschlagskalkulation, Deckungsbeitrag, Break-Even-Point, Handwerker-Zinsrechnung

4. **Gestochen scharfer DIN-A4 PDF-Export:**
   - Klicke oben rechts auf **"PDF erstellen / Drucken"** (oder drücke `Strg + P`).
   - Wähle als Ziel **"Als PDF speichern"**.
   - **Tipp:** Aktiviere unter *"Weitere Einstellungen"* den Haken **"Hintergrundgrafiken"**, damit alle Rahmen und Farbakzente gedruckt werden.
   - Da KaTeX Vektorschriften nutzt, ist der PDF-Ausdruck gestochen scharf und bleibt beim Zoomen oder Drucken perfekt lesbar.

5. **Speichern & Teilen:**
   - Automatisches Speichern im Browser (`localStorage`).
   - Export & Import als `.json`-Datei zur Sicherung oder zum Weitergeben an Meisterkollegen.
