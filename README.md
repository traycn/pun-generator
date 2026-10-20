# Pun Generator

The project that started it all, revived.

## From 2012 to now
In 2012 I built my first console application, which generated a pun to share with the pun-derful people in my life ([the story on my portfolio](https://traycn.github.io/)).

This version keeps the idea and adds a shuffle bag so puns don't repeat until the whole topic has been shown, topic filters, an experimental template generator, xUnit tests, shared data in `data/` for both the console app and the web page, and an accessible web easter egg on my portfolio. Try typing `pun` there.

## Run it
```bash
cd cli
dotnet run -- --topic code --count 3     # curated puns, filtered by topic
dotnet run -- --generated --count 3      # experimental template puns
dotnet run -- --seed 42                  # deterministic order
```

Run the tests from the repo root:
```bash
dotnet test tests
```

## Web
`web/index.html` is a static page (no build step) with topic chips and an "Another one" button. It loads `data/puns.json`, so serve the repo root rather than opening the file directly:
```bash
python3 -m http.server
# then visit http://localhost:8000/web/
```

`web/pun-egg.js` is the portfolio easter egg. Add it to the site with:
```html
<script src="/pun-egg.js" defer></script>
```
It finds `puns.json` relative to itself (`../data/puns.json`); if you publish it elsewhere, set `data-puns="/path/to/puns.json"` on the script tag. If the script or the data fails to load, nothing happens on the host page.
