# Dr. M.R.S. Suryanarayana Reddy Static Website

Static profile website for Dr. M.R.S. Suryanarayana Reddy.

## Files

- `index.html` - home page matching the supplied reference design.
- `about.html` - detailed profile page built from the 2026 CV.
- `assets/styles.css` - shared responsive styling.
- `assets/app.js` - mobile navigation and static form behavior.
- `assets/dr-mrssn-reddy-cv-2026.pdf` - downloadable profile PDF.

## Run Locally

Open `index.html` in a browser, or serve this folder with any static server.

```bash
python3 -m http.server 8000
```

## Vercel

The repo includes `vercel.json`, which runs `npm run build` and serves the generated
`dist` folder. This keeps the deployment independent of dashboard framework guesses.

```bash
npm run build
```
