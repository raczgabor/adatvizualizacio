# AI Job Trends Data Story

Modern, minimalista egyoldalas adatvizualizációs projekt az `ai_job_trends_dataset.csv` adatkészlettel.

## Projekt fókusz

A weboldal célja nem a bonyolult alkalmazáslogika, hanem egy jól követhető adatsztori:

1. Iparági átrendeződés 2024 -> 2030  
2. Bér és automatizációs kockázat kapcsolata  
3. Oktatás x iparág kockázati hőtérkép  
4. Távmunka és AI-hatás kapcsolata  
5. Legkitetettebb és legbiztonságosabb munkakörök

## Technológia

- HTML + CSS (minimalista UI)
- Vega / Vega-Lite / Vega-Embed (CDN)
- ES Modules JavaScript

## Fájlstruktúra

- `index.html` - oldal és narratív szekciók
- `styles/main.css` - modern, letisztult stílus
- `js/main.js` - chartok renderelése
- `js/charts/*.js` - külön Vega-Lite specifikációk
- `ai_job_trends_dataset.csv` - adatforrás

## Futtatás lokálisan

Böngészőből közvetlenül (`file://`) a CSV betöltése CORS miatt problémás lehet, ezért indíts helyi szervert:

```bash
python3 -m http.server 8000
```

Majd nyisd meg: [http://localhost:8000](http://localhost:8000)

## Adatforrás

- Fájl: `ai_job_trends_dataset.csv`
- Fontosabb oszlopok:
  - `Industry`
  - `Job Title`
  - `AI Impact Level`
  - `Median Salary (USD)`
  - `Job Openings (2024)`
  - `Projected Openings (2030)`
  - `Remote Work Ratio (%)`
  - `Automation Risk (%)`
  - `Required Education`

## GitHub publikálás

1. Hozz létre új repót GitHubon.
2. Pushold fel a projektet.
3. Opcionális: GitHub Pages bekapcsolása (`Settings` -> `Pages` -> branch root).

## Megjegyzés

A vizualizációk feltáró jellegűek. A grafikonok trendeket és mintázatokat mutatnak, nem oksági bizonyítékot.
