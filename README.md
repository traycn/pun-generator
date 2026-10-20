# Pun Generator

The project that started it all, revived.

## From 2012 to now
**Then:** my first console application, a small C# program that served puns to the pun-derful people in my life. One idea, one evening, no ambitions beyond making someone groan.

**Now:** the same idea, grown up a little.

| | 2012 | Now |
|---|---|---|
| Idea | A console app that serves puns | Unchanged. It still serves puns, and `dotnet run` still prints one |
| Puns | Baked into the program | Shared data in `data/puns.json`, used by both the CLI and the web page |
| Picking one | Just serve a pun | A shuffle bag: no repeats until every pun in the topic has been shown, with `--topic` filters and `--seed` for repeatable runs |
| Generated puns | None | An experimental template engine (`--generated`) that fills patterns from `data/wordplay.json`, clearly labelled because templated puns are hit-or-miss |
| Tests | None | xUnit tests for the shuffle bag, topic filtering and the template generator |
| Where it lives | A console window | The console, plus a static web page and an easter egg on my portfolio: type `pun` (or the Konami code) on https://traycn.github.io/ |
| Accessibility | Not a concern for a console app | New puns are announced through an `aria-live` region, buttons have visible focus styles, and the modal traps focus and works in light and dark mode |

What stayed the same is the point: small, charming, and built to be finished in an evening.

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
