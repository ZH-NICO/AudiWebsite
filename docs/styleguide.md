# Styleguide — Audi Motion Shop (M293 PA03)

Dieses Dokument beschreibt das visuelle System und die Design-Richtlinien für den Audi Webshop. Das Design ist stark an der modernen, minimalistischen Ästhetik der Marke Audi (audi.ch) orientiert.

## 1. Farbpalette

Das Farbschema basiert auf einer klassischen Kombination aus Weiss, Schwarz und dem markanten Audi Rot als Akzentfarbe.

| Variable | Hex-Wert | Verwendung |
| :--- | :--- | :--- |
| `--bg` | `#ffffff` | Haupt-Hintergrund |
| `--bg-2` | `#f5f5f5` | Sekundärer Hintergrund (Sektionen) |
| `--bg-3` | `#eeeeee` | Tertiärer Hintergrund / Hover-States |
| `--text` | `#111111` | Haupttext, Überschriften |
| `--text-muted` | `#666666` | Untertitel, Beschreibungen |
| `--text-dim` | `#9a9a9a` | Dezentere Texte (Platzhalter) |
| `--accent` | `#d5001c` | Audi Rot (Primärer Akzent, Links, Badges) |
| `--accent-h` | `#ff1838` | Akzentfarbe bei Hover |
| `--border` | `rgba(0,0,0,0.12)` | Dezente Trennlinien |
| `--border-h` | `rgba(0,0,0,0.28)` | Stärkere Trennlinien / Hover-Borders |

### Spezialfarben (Badges)
- `--badge-elec`: `#0d8a7a` (e-tron / Elektro)
- `--badge-hybrid`: `#8a5a0d` (Hybrid-Modelle)
- `--badge-perf`: `#7a0a1a` (RS / Performance)

---

## 2. Typografie

Das Projekt nutzt zwei primäre Schriftarten, um den Premium-Charakter zu unterstreichen.

- **Display & Headlines:** `Inter` (Sans-Serif) – Klar, modern und präzise.
- **Fliesstext:** `Inter` (Sans-Serif) – Hohe Lesbarkeit auf allen Geräten.
- *(Anmerkung: In der `index.html` wird zusätzlich `Cormorant Garamond` geladen, um für spezielle Akzente oder kursive Schnitte ein edles Schriftbild zu ermöglichen).*

| Element | Schriftart | Grösse | Gewicht | Besonderheit |
| :--- | :--- | :--- | :--- | :--- |
| `h1` | `Inter` | `clamp(2.4rem, 4vw, 3.8rem)` | 600 | Line-height: 1.08 |
| `h2` | `Inter` | `1.35rem` | 600 | Modellfamilien-Titel |
| `h3` | `Inter` | `1.3rem` | 600 | Card-Headings |
| `.eyebrow` | `Inter` | `0.67rem` | 600 | All-caps, Letter-spacing: 0.22em |
| `body` | `Inter` | `1rem` | 400 | Line-height: 1.6 |

---

## 3. Abstände & Layout

Das Layout nutzt ein modernes Grid-System mit grosszügigen Abständen (White Space).

- **Max-Width:** `1360px` (Zentrierter Content-Container)
- **Standard Padding:** `3.5rem 3rem 5rem` (Page Content)
- **Grid Gaps:** Meist `1px` (Trennlinien-Look durch Hintergrundfarbe)
- **Header Höhe:** `68px` (Fixiert am oberen Rand)

---

## 4. Komponenten

### Buttons
- **.btn-primary:** Hintergrund `#111`, Text `#fff`. Klassischer Audi-Look.
- **.btn-ghost:** Transparent mit Rahmen. Für sekundäre Aktionen.
- **.btn-outline:** Weisser Rahmen auf dunklem Hintergrund.
- **Interaktion:** Alle Buttons besitzen einen subtilen "Light Sweep" Effekt bei Hover (`::before` Animation).

### Cards
- **.car-card:** Minimalistisches Design mit Bild, Kategorie in Rot, Titel und Meta-Informationen.
- **.review-card:** Nutzt `Inter` für Zitate und Audi Rot für die Sterne.
- **.service-card:** Fokus auf Icons und kurze Beschreibungen.

### Forms
- **Input/Select:** Transparenter Hintergrund mit feinem Rahmen. Fokus-Zustand nutzt das Audi Rot (`--accent`) für den Rahmen und einen zarten Glow.

### Navigation
- **Header:** Nutzt `backdrop-filter: blur(18px)` für einen modernen Milchglas-Effekt.
- **Nav-Links:** Subtile Unterstreichung von links nach rechts bei Hover.

---

## 5. Animationen

Animationen werden gezielt eingesetzt, um Wertigkeit zu vermitteln:

- **fadeUp:** Weiches Einblenden von Inhalten von unten nach oben.
- **heroBreath:** Subtiler Zoom-Effekt für das Hero-Bild.
- **carSlide:** Sanfter Übergang zwischen Bildern in der Slideshow.
- **detailOpen:** Schnelles, weiches Aufklappen von Accordions (Details) oder Dropdowns.
- **lightSweep:** Ein Glanzeffekt, der bei Hover über Buttons fährt.

---

## 6. Responsives Verhalten

Das Design passt sich fliessend an verschiedene Bildschirmgrössen an:

- **Desktop (>1200px):** 4 Spalten im Fahrzeug-Grid.
- **Tablet (700px - 1200px):** Reduktion auf 3 oder 2 Spalten. Header-CTA wird teilweise ausgeblendet.
- **Mobile (<700px):** 1 Spalte. Navigation wird durch ein kompaktes Menü ersetzt (Profil-Button). Font-Grössen werden via `clamp()` skaliert.

---

## 7. Barrierefreiheit (Accessibility)

- **Semantik:** Nutzung von `<header>`, `<nav>`, `<main>`, `<article>`, `<section>` und `<aside>`.
- **Aria-Attribute:** `aria-label`, `aria-hidden`, `aria-haspopup` und `aria-controls` werden für interaktive Elemente genutzt.
- **Motion:** Unterstützung für `prefers-reduced-motion: reduce`, um Animationen für empfindliche Nutzer zu deaktivieren.
- **Kontrast:** Hoher Kontrast zwischen Text (#111) und Hintergrund (#fff) für optimale Lesbarkeit.
