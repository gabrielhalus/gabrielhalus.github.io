---
title: "Startup Data Injection (Seeding Strategy)"
excerpt: "After years with Node.js, I made the leap to Bun. Here's what changed, what broke, and why I'm not looking back."
date: "2026-01-28"
readingTime: "8 min read"
category: "FullStack"
tags:
  - "TypeScript"
  - "Database"
pinned: false
order: 2
---

## Goals

- Inject **system data** (Roles, Policies, Settings, etc.) at API startup
- Ensure **idempotency** (safe to run multiple times)
- Track **what was injected**, **from which version**, and **when**
- Allow **incremental updates** without wiping data
- Work in **distributed / multi-instance** setups

---

## Concepts

### 1. Seed Categories

Only **non-user, deterministic data** is injected at startup.

Examples:

- Roles (`admin`, `user`, `service`)
- Policies / Permissions
- Feature flags
- System settings
- Default configuration trees

Never seed:

- Users
- Runtime data
- Environment-specific secrets

---

### 2. Seed Meta Files (Source of Truth)

Each seed lives in a **versioned meta file**.

```
packages/shared/seeds/
  ├─ 001-roles.seed.ts
  ├─ 002-policies.seed.ts
  ├─ 003-settings.seed.ts
```

Example:

```ts
export const seed = {
  id: "roles",
  version: 1,
  description: "Base system roles",
  data: [
    { key: "admin", label: "Administrator" },
    { key: "user", label: "User" },
  ],
} as const;
```

Rules:

- `id` is **stable**
- `version` increments when seed logic or data changes
- `data` is **pure and deterministic**
- No DB logic inside seed files

---

### 3. Seed Tracking Table

A dedicated table tracks execution state.

```ts
export const seedsTable = sqliteTable("seeds", {
  id: text("id").primaryKey(),
  version: integer("version").notNull(),
  checksum: text("checksum").notNull(),
  appliedAt: integer("applied_at", { mode: "timestamp" }).notNull(),
});
```

Purpose:

- Prevent re-applying the same seed
- Detect changes via checksum
- Allow controlled upgrades

---

### 4. Checksum Strategy

Checksum ensures **data integrity**, not just versioning.

```ts
function computeChecksum(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}
```

Why:

- Protects against silent data changes
- Enables safe hotfixes without version bumps (optional)

---

## Injection Flow (At API Startup)

### High-Level Flow

1. Load all seed meta files
2. Sort by filename or explicit order
3. For each seed:
   - Check existing record in `seeds` table
   - Compare `version` and `checksum`
   - Apply only if needed
4. Store/update tracking record
5. Log clearly (one line per seed)

---

### Execution Logic

```ts
for (const seed of seeds) {
  const checksum = computeChecksum(seed.data);

  const existing = await db
    .select()
    .from(seedsTable)
    .where(eq(seedsTable.id, seed.id))
    .get();

  if (existing && existing.version === seed.version && existing.checksum === checksum) {
    continue;
  }

  await db.transaction(async (tx) => {
    await applySeed(tx, seed);
    await tx
      .insert(seedsTable)
      .values({
        id: seed.id,
        version: seed.version,
        checksum,
        appliedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: seedsTable.id,
        set: {
          version: seed.version,
          checksum,
          appliedAt: new Date(),
        },
      });
  });
}
```

---

## 5. Applying Seeds Safely

### Upsert-only Logic

Never delete unless explicitly required.

```ts
async function applySeed(
  tx: DrizzleTransaction,
  seed: SeedMeta,
): Promise<void> {
  switch (seed.id) {
    case "roles":
      await tx
        .insert(rolesTable)
        .values(seed.data)
        .onConflictDoNothing();
      break;
  }
}
```

Benefits:

- Safe across restarts
- Safe in multi-instance deployments
- No race conditions with proper DB constraints

---

## 6. When Seeds Run

- **At API startup**
- **Before serving requests**
- Optional env guard:

```ts
if (process.env.SEED_ON_STARTUP === "true") {
  await runSeeds();
}
```
