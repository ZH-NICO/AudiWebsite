# Audi Motion Shop — M293 PA03 Projektauftrag

> Audi-inspirierter Premium-Webshop. Statisch, responsive, framework-frei.

Dieses Projekt wurde im Rahmen des Moduls M293 an der TBZ (Technische Berufsschule Zürich) erstellt. Es handelt sich um eine statische Web-Applikation, die das Look & Feel der offiziellen Audi-Website (audi.ch) emuliert und 14 verschiedene Fahrzeugmodelle in einem modernen Showroom präsentiert.

## Übersicht
Der Audi Motion Shop bietet eine nahtlose Nutzererfahrung über drei separate Seiten. Nutzer können durch die Modellpalette stöbern, detaillierte technische Daten einsehen, Videos ansehen und interaktive Bestellformulare nutzen. Das Design folgt dem Prinzip "Vorsprung durch Technik" — minimalistisch, präzise und hochwertig.

## Funktionen
- **Interaktiver Showroom:** Übersicht über 14 Audi Modelle mit Filterfunktionen (A-Serie, Q-Serie, RS, e-tron).
- **Produktdetails:** Detaillierte Spezifikationen, Serienausstattung und Preise für jedes Modell.
- **Premium Design:** Vollständig responsive (Mobile, Tablet, Desktop) mit Audi-spezifischen Design-Tokens.
- **Interaktive Slideshows:** CSS-basierte Bildergalerien mit Premium-Animationen.
- **User Management:** Firebase Authentication Integration mit automatischem Fallback auf `localStorage` (Demo-Modus).
- **Warenkorb-System:** Fahrzeuge können virtuell gemerkt/bestellt werden.
- **Kontakt & Service:** Umfassendes Kontaktformular, FAQ-Bereich (Accordion) und Newsletter-Anmeldung.

## Technologie-Stack
- **HTML5:** Semantische Struktur für SEO und Barrierefreiheit.
- **CSS3:** Custom Properties (Variablen), CSS Grid, Flexbox und Keyframe-Animationen.
- **Vanilla JavaScript:** ES Modules, DOM-Manipulation und State Management ohne externe Frameworks.
- **Firebase:** Geplant für Hosting und (optional) Authentication.

## Seiten
- **Startseite** (`index.html`) — Hero-Bereich, empfohlene Modelle, Kategorieübersicht und Newsletter.
- **Fahrzeuge** (`produkte.html`) — Modellfamilien-Selektor, 14 Produktdetails mit Videos und Bestellformularen.
- **Kontakt** (`kontakt.html`) — Team, Kontaktformular mit Betreff-Dropdown, FAQ und Kontaktinformationen.

## Lokal ausführen
Da das Projekt auf modernen ES-Modulen basiert, kann es direkt geöffnet werden:
```bash
# Einfach index.html im Browser öffnen, oder für lokales Hosting:
npx serve .
```

## Veröffentlichen
Das Projekt ist für Firebase Hosting vorbereitet:
```bash
npx -y firebase-tools deploy --only hosting
```

## Links
- **Live-URL:** [Nach Deployment einfügen, z.B. https://audi-motion-shop.web.app]
- **Repository:** [Repository-URL einfügen]

## Dokumentation
Weitere Details zur Planung und zum Design finden sich im `docs/` Verzeichnis:
- [Wireframes](docs/wireframes.md) — Layout-Skizzen für alle Breakpoints.
- [Styleguide](docs/styleguide.md) — Farben, Typografie und Komponenten (Deutsch).
- [KI-Dokumentation](docs/ki-dokumentation.md) — Dokumentation des KI-Einsatzes (Deutsch).

## Dateistruktur
```
├── index.html          # Startseite
├── produkte.html       # Fahrzeugübersicht & Produktdetails
├── app.js              # JavaScript Logik (Auth, Warenkorb, UI-Events)
├── firebase-config.js  # Firebase Initialisierung
├── kontakt.html        # Kontakt, Team & FAQ
├── styles.css          # Zentrales Stylesheet
├── assets/
│   └── images/         # Fahrzeugbilder und Marken-Assets
├── docs/
│   ├── wireframes.md   # Visuelle Planung
│   ├── styleguide.md   # Design-System Dokumentation
│   └── ki-dokumentation.md # Reflexion der KI-Nutzung
└── firebase.json       # Hosting Konfiguration
```

## Lizenz
Schulprojekt der TBZ — nur für Ausbildungszwecke. Audi ist eine eingetragene Marke der AUDI AG. Die verwendeten Bilder dienen ausschliesslich der Visualisierung im Rahmen des Unterrichts.
