# Contributing

Thank you for helping document Reddit's recognition systems.

## Add or update an entry

Every entry should include:

- Stable `id` and displayed name.
- System: achievement, trophy, award, or a legacy variant.
- Category and concise description.
- Unlock summary and structured criteria when known.
- Verification status and availability status.
- At least one direct source URL.
- Notes for ambiguity, rollout limits, or conflicting reports.

## Source quality

Preferred order:

1. Official Reddit Help Center or Reddit announcements.
2. Direct evidence from Reddit product UI, with date and context.
3. Established community-maintained lists with links to supporting discussions.
4. Individual user reports, used only as leads unless corroborated.

## Do not

- Invent unlock thresholds.
- Treat awards as profile achievements.
- Assume a feature is available to every account.
- Mark an item retired merely because it is not visible to one user.
- Copy a community list without checking its update date and evidence.

## Validation

Keep `data/achievements.json` valid JSON and ensure every source URL is direct and relevant. The dataset is intended to be validated against `data/schema.json` as automated checks are added.
