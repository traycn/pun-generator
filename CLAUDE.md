# CLAUDE.md — Pun Generator (the 2012 origin story, revived)

## Goal
Recreate the portfolio's origin story: a small C# console app that serves puns. Then give it a tiny web front end so it can live on traycn.github.io as an easter egg. Keep it charming and small, and make it a one-evening project.

## Constraints
- `cli/`: .NET 10 console app, no dependencies beyond the BCL. Mirrors the "first console application" from 2012.
- `web/`: one static HTML page with plain JS (no build step), so it drops straight into the GitHub Pages site. It must match the site's existing look (HTML5 UP template) and work in light and dark mode.
- Shared data: `data/puns.json` is the single source for both.
- All puns must be original or clearly credited. Do not scrape pun sites.
- Accessibility: the new pun is announced via an `aria-live="polite"` region, and there's a visible focus style on the button.

## Two pun modes
1. **Curated**: pick a random pun from `data/puns.json`, optionally filtered by topic (`--topic code`). Never repeat until all puns in that topic have been shown (shuffle bag).
2. **Generated**: a template engine that fills patterns from `data/wordplay.json`.
   - Example template: `"Why did the {noun} {verb}? It {punchline}."`
   - Each wordplay entry pairs a setup word with a sound-alike payoff, e.g., `{"word": "dough", "soundsLike": "though", ...}`.
   - Generated output is clearly labeled "experimental" because templated puns are hit-or-miss. That honesty is part of the charm.

## Milestones

### M1 — Console app
- `dotnet run -- [--topic <t>] [--count <n>] [--generated]`
- Shuffle-bag selection with optional `--seed` for deterministic tests.
- **Accept:** xUnit tests for the shuffle bag (no repeats within a cycle) and topic filtering.

### M2 — Template generator
- Implement templates with slot filling from `wordplay.json`. Reject outputs that reuse the same word in two slots.
- **Accept:** tests with a fixed seed produce a known string.

### M3 — Web easter egg
- `web/index.html` loads `../data/puns.json`, shows one pun, has a "Another one" button and topic chips.
- Hidden trigger on the main site: typing "pun" anywhere (or the Konami code) opens a small modal. Don't hijack keys while focus is in a form field.
- **Accept:** works with JS from the GitHub Pages origin, and the main site is unaffected when the script fails to load.

### M4 — Origin note
- A short "From 2012 to now" section in README with a then/now comparison: the original idea, and what's different in this version (tests, accessibility, shared data).

## Definition of done
`dotnet run` prints a pun, and visiting the portfolio and typing "pun" shows one too.
