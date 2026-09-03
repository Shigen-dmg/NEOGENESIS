# NEOGENESIS

A dependency-free static research and media website built with HTML, CSS, and JavaScript.

## Run locally with VS Code

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. In VS Code, install the **Live Server** extension by Ritwick Dey.
3. Open this `NEOGENESIS` project folder in VS Code.
4. Right-click `index.html` in the Explorer.
5. Choose **Open with Live Server**.

The site will open at a local address such as `http://127.0.0.1:5500`.

## Add research

Research records live in `js/research-data.js`. Duplicate an existing object, assign it a unique ID, and update its fields. The homepage, database, filters, counters, random-node action, and command search all read from this shared array.

Set `available: true` only when a corresponding long-form article page is ready. The current example article is `NG-R001` in `article.html`.

## Project notes

- No package installation or build step is required.
- Google Fonts are loaded over the web; system font fallbacks are included.
- All core layouts and interactions run through Live Server without a backend.
