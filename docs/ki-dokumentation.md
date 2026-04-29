# KI-Dokumentation — Audi Motion Shop (M293 PA03)

In diesem Dokument wird der Einsatz von Künstlicher Intelligenz (KI) während der Entwicklung des Audi Webshop-Projekts dokumentiert und reflektiert.

## 1. Einleitung

Für die Erstellung dieses Projekts wurden verschiedene KI-Tools eingesetzt, um die Effizienz zu steigern, komplexe Layout-Herausforderungen zu lösen und die Code-Qualität sicherzustellen. Die primär genutzten Tools waren **ChatGPT (OpenAI)** für konzeptionelle Fragen und **VS Code Copilot / Gemini** für die direkte Code-Unterstützung während der Implementierung.

## 2. Einsatzbereiche

### Layout & Design
KI wurde genutzt, um das visuelle System von Audi zu analysieren und in CSS-Variablen zu übersetzen. Insbesondere die Erstellung der "Audi-typischen" Abstände und des minimalistischen Farbschemas wurde durch KI-Vorschläge unterstützt.

### Code-Generierung
Die Grundstruktur der HTML-Seiten und die repetitiven Elemente (wie die 14 verschiedenen Fahrzeug-Detail-Sektionen) wurden teilautomatisiert erstellt. Dies half dabei, eine konsistente Datenstruktur über alle Modelle hinweg beizubehalten.

### Problemlösung
Besondere Herausforderungen wie das **hash-basierte Routing** (Single Page App Verhalten ohne Framework) und die **Slideshow-Logik** mit CSS-Animationen wurden mithilfe von KI-Debuggings gelöst. Auch die Integration des Firebase-Fallbacks auf `localStorage` wurde so implementiert.

### UI-Optimierung
Details wie der "Light Sweep" Effekt auf Buttons oder die sanften Übergänge zwischen den "Pages" wurden durch KI-Vorschläge für `cubic-bezier` Kurven verfeinert.

---

## 3. Tool-Vergleich

Im Projekt wurden vor allem ChatGPT und die VS Code Integration verglichen:

| Kriterium | ChatGPT (Web) | VS Code Copilot / Gemini |
| :--- | :--- | :--- |
| **Code-Qualität** | Sehr gut für isolierte Logik-Snippets. | Gut, da der Kontext der gesamten Datei bekannt ist. |
| **Geschwindigkeit** | Etwas langsamer durch Copy-Paste. | Extrem schnell durch Inline-Vorschläge. |
| **Erklärungen** | Sehr ausführlich und konzeptionell stark. | Oft kurz und knapp auf die Zeile bezogen. |
| **Workflow** | Unterbricht den Fokus (Browser-Tab). | Nahtlos im Editor integriert. |
| **Grenzen** | Verliert bei sehr langen Files den Überblick. | Schlägt manchmal veraltete Attribute vor. |

---

## 4. Prompt-Beispiele

Hier sind fünf konkrete Prompts, die während der Entwicklung genutzt wurden:

1. **"Erstelle eine Audi-inspirierte Premium-Header-Komponente mit CSS Backdrop-Blur und einem zentrierten Logo."**
   - *Ergebnis:* Die CSS-Klassen für den Header mit `backdrop-filter` und die absolute Positionierung des Logos.
2. **"Schreibe eine CSS-Slideshow-Animation, die drei Bilder nacheinander einblendet, ohne JavaScript zu verwenden."**
   - *Ergebnis:* Die `@keyframes carSlide` Logik mit zeitversetzten Animation-Delays.
3. **"Implementiere einen Auth-Flow in Vanilla JS, der prüft, ob ein User eingeloggt ist, und falls nicht, Daten im localStorage speichert."**
   - *Ergebnis:* Die Grundstruktur der `app.js` Logik für das User-Management.
4. **"Optimiere ein CSS-Grid für Mobile, sodass aus 4 Spalten automatisch 1 Spalte wird, wenn der Viewport kleiner als 700px ist."**
   - *Ergebnis:* Die Media-Queries unter `@media (max-width:700px)`.
5. **"Erstelle ein Kontaktformular mit einem Dropdown für Audi-Modelle und validiere, dass die E-Mail ein korrektes Format hat."**
   - *Ergebnis:* Das HTML-Formular in `kontakt.html` mit den entsprechenden `required` Attributen.

---

## 5. Reflexion

Der Einsatz von KI war für dieses Projekt ein massiver Beschleuniger. Besonders bei repetitiven Aufgaben (wie den Fahrzeug-Specs) spart es Stunden an Zeit. 

**Was KI gut kann:**
- Schnelle Syntax-Checks und Boilerplate-Generierung.
- Vorschläge für moderne CSS-Features (Grid, Flexbox).
- Debugging von Logik-Fehlern in JavaScript.

**Herausforderungen:**
- KI neigt dazu, unnötig komplizierte Lösungen vorzuschlagen, wenn der Prompt nicht präzise ist.
- Das "Fine-Tuning" von Design-Details (wie der exakte Rot-Ton oder Abstände) erfordert weiterhin menschliches Auge und manuelle Korrektur.
- Ethisch ist wichtig, den generierten Code nicht blind zu übernehmen, sondern zu verstehen und an die Projekt-Anforderungen anzupassen.
