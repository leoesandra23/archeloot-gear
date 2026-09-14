# ArcheAge Classic equipment database

The calculator consumes the category files through `catalog.ts`.

## Slot compatibility

Items may declare `allowed` with exact calculator slot IDs. When `allowed` is absent, V11 applies conservative name/description rules in `src/app/page.tsx` so an armor item is not offered in a weapon slot, a bow is not offered as a shield, and accessories are separated into ear/neck/ring/bracelet slots.

## Grade

The UI uses the public grade names: Basic, Crude, Grand, Rare, Arcane, Heroic, Unique, Celestial, Divine, Epic, Legendary, Mythic, Eternal.

## Temper

Temper is represented as 100–115%. It modifies only the stats treated as temperable by the calculator and does **not** add Gear Score. Exact item-specific temper behavior should be filled from verified item data as the database expands.

## Data integrity

When a public source does not publish a value, keep it `n/d`/zero in the display rather than inventing a value. Mark source-backed records with `verified: true` and include `sourceUrl` where available.
