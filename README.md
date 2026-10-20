# Pun Generator

The project that started it all, revived.

## From 2012 to now
**Then:** in 2012 I built my first console application. It generated a pun to share with the pun-derful people in my life, and it led me to dive head-first into software development. (That's the whole story as my [portfolio](https://traycn.github.io/) tells it; I no longer have the original details.)

**Now:** the same idea, grown up a little.

| | 2012 | Now |
|---|---|---|
| Idea | My first console application: it generated a pun to share with people in my life | Unchanged. It still serves puns, and `dotnet run` still prints one |
| Where it runs | A console application | The console, plus a static web page and an easter egg on my portfolio: type `pun` (or the Konami code) on https://traycn.github.io/ |
| Generating puns | It generated a pun (how isn't recorded) | Two modes: curated puns from `data/puns.json`, and an experimental template engine (`--generated`) that fills patterns from `data/wordplay.json`, clearly labelled because templated puns are hit-or-miss |
| Picking one | Not recorded | A shuffle bag: no repeats until every pun in the topic has been shown, with `--topic` filters and `--seed` for repeatable runs |
| Where the puns live | Not recorded | Shared data in `data/puns.json`, used by both the CLI and the web page |
| Tests | Not recorded | xUnit tests for the shuffle bag, topic filtering and the template generator |
| Accessibility | Not recorded | New puns are announced through an `aria-live` region, buttons have visible focus styles, and the modal traps focus and works in light and dark mode |

The "Not recorded" cells are deliberate: I'd rather leave the 2012 version's details blank than invent them.

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
