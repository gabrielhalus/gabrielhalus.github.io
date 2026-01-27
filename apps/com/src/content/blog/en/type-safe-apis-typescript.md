---
title: "Building Type-Safe APIs with TypeScript and Zod"
excerpt: "Learn how to create bulletproof API contracts using TypeScript's type system combined with runtime validation through Zod schemas."
date: "2025-01-15"
readingTime: "8 min read"
category: "Engineering"
tags:
  - TypeScript
  - Zod
  - API Design
  - Type Safety
pinned: true
order: 1
---

Type safety at compile time is great, but what about runtime? When data crosses system boundaries—from API responses, form inputs, or external services—TypeScript's guarantees disappear. This is where Zod becomes invaluable.

## The Problem with Trust

Consider a typical API call:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const user = await fetch('/api/user').then(r => r.json()) as User;
```

That `as User` is a **lie**. We're telling TypeScript to trust that the response matches our interface, but we have no runtime guarantee. If the API returns `{ id: 123 }` instead of `{ id: "123" }`, TypeScript won't save us.

## Enter Zod

Zod is a TypeScript-first schema validation library. It lets us define schemas that serve as both runtime validators and TypeScript type sources:

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;
```

Now we have a single source of truth. The `User` type is derived from the schema, and we can validate data at runtime:

```typescript
const response = await fetch('/api/user').then(r => r.json());
const user = UserSchema.parse(response); // Throws if invalid
```

## Building a Type-Safe API Client

Here's a pattern I use for API clients that combines the best of both worlds:

```typescript
const api = {
  user: {
    get: async (id: string): Promise<User> => {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      return UserSchema.parse(data);
    },

    create: async (input: UserInput): Promise<User> => {
      const validated = UserInputSchema.parse(input);
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(validated),
      });
      return UserSchema.parse(await response.json());
    },
  },
};
```

This approach validates both inputs and outputs, ensuring type safety flows through the entire request cycle.

## Error Handling That Makes Sense

Zod's error messages are developer-friendly by default, but you can customize them:

```typescript
const UserSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  age: z.number().min(18, { message: "Must be 18 or older" }),
});
```

For user-facing forms, this makes error handling straightforward and consistent.

## The Bigger Picture

Type-safe APIs aren't just about catching bugs—they're about **confidence**. When you know your data contracts are enforced at every boundary, you can refactor fearlessly. Your IDE becomes smarter. Your tests become simpler.

The initial investment in proper schemas pays dividends throughout your codebase's lifetime. Start small, validate at boundaries, and let the type system guide your design.
