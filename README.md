# Reddit Achievements

A community-researched, source-linked catalogue of Reddit achievements, profile badges, legacy trophies, and historical unlocks.

> Discover what exists, understand how each item is earned, and distinguish confirmed information from community reports.

## Project goals

- Catalogue Reddit's current achievement badges and their unlock conditions.
- Document legacy profile trophies and retired or event-limited items separately.
- Explain eligibility, progress, rarity, unlock counts, and visibility where sources confirm them.
- Link every factual entry to an official Reddit source or a clearly labelled community source.
- Track changes over time instead of silently treating old information as current.
- Provide a searchable website and machine-readable JSON dataset.

## Important terminology

Reddit uses more than one recognition system. This project keeps them separate:

1. **Achievements** — the newer profile feature covering participation, community contribution, and platform tasks.
2. **Trophies** — profile honours shown in the Trophy Case, including account, event, and contribution-related awards.
3. **Awards** — awards attached to posts/comments; these are not the same as profile achievements.
4. **Legacy / retired items** — historical achievements or trophies that may no longer be obtainable.

## Verification policy

Each entry must carry a status:

- `official` — directly supported by current Reddit Help or an official Reddit announcement.
- `community` — reported by users or community-maintained lists, not independently confirmed by Reddit.
- `historical` — evidence describes a past feature or retired item; current availability is not implied.
- `unverified` — a lead that still needs reliable evidence.

A community-reported count is never presented as an official total. Requirements can vary by rollout, account, community eligibility, and feature changes.

## Current research baseline

The official Reddit Help Center currently documents these community achievements:

- Elder
- Repeat Contributor
- Super Contributor
- Content Connoisseur
- Flag Planter
- That's Me
- Rising Star
- Picasso
- Top %

The official help article gives the unlock criteria for these entries. See the source links below. This list is a verified starting subset, **not a claim that the full Reddit achievement catalogue contains only these items**.

## Sources

### Official Reddit sources

- [What are achievements?](https://support.reddithelp.com/hc/en-us/articles/27063106698004-What-are-achievements)
- [Community Achievements](https://support.reddithelp.com/hc/en-us/articles/25564722077588-Community-Achievements)
- [What are trophies and where can I find them?](https://support.reddithelp.com/hc/en-us/articles/360043045092-What-are-trophies-and-where-can-I-find-them-on-my-profile)
- [Reddit Help Center changelog — June 25, 2024](https://support.reddithelp.com/hc/en-us/articles/27664798081812-Changelog-June-25-2024)

### Community research

Community lists and discussions are useful discovery sources, but entries sourced only from them remain labelled as community-reported until corroborated.

## Repository structure

```text
.
├── README.md
├── data/
│   ├── achievements.json
│   └── schema.json
└── docs/
    ├── CONTRIBUTING.md
    └── VERIFICATION.md
```

## Contributing

Before adding an entry, provide its name, category, unlock requirement, source URL, source type, and verification status. Do not guess hidden thresholds or present speculation as fact. See [CONTRIBUTING.md](docs/CONTRIBUTING.md).

## Disclaimer

Reddit and its product names are trademarks of Reddit, Inc. This is an independent, unofficial research project and is not affiliated with or endorsed by Reddit. Achievement availability and requirements may change.
