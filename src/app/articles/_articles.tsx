type Article = {
  title: string;
  slug: string;
  description: string;
  date: string;
  readTime: number;
  tags: string[];
  author: string;
  markdown: string;
};

export const articles: Article[] = [
  {
    title: "Fine-Grained Authorization with ABAC in the BHVR Stack",
    slug: "fine-grained-authorization-with-abac-in-the-bhvr-stack",
    description:
      "Learn how to implement Attribute-Based Access Control (ABAC) in the BHVR stack (Bun + Hono + Vite + React) for secure, granular permissions across your full-stack application.",
    date: "2025-07-10",
    markdown: `
## Part 1: Concepts - What Is ABAC and Why It Matters

**Attribute-Based Access Control (ABAC)** is a powerful and flexible way to control who can do what in your application. Instead of just checking roles (like "admin" or "editor"), ABAC checks **attributes** of the user, the resource, and the context.

### 🔐 What is ABAC?

- A user can edit a post **only if they are the owner**
- A viewer can only read a document **if it is published**
- An admin can manage all posts, **regardless of ownership**

### 🆚 ABAC vs. RBAC

| **Model** | **Description** | **Example** |
| --- | --- | --- |
| **RBAC** | Role-Based Access Control | Editors can edit all posts |
| **ABAC** | Attribute-Based Access Control | Editors edit **only their own** posts |

ABAC is more granular and expressive. It fits real-world rules better, especially in multi-tenant systems or apps with complex permissions.

### 🎯 Benefits of ABAC in Modern Web Apps

- ✅ Centralized and reusable logic
- ✅ Better security boundaries
- ✅ Declarative and testable
- ✅ Easy to adapt over time

### 📦 Why BHVR + ABAC

The **BHVR stack** (Bun + Hono + Vite + React) is fast and modern - and with ABAC, you can enforce authorization in both backend and frontend using shared logic:

- **Backend (Hono)**: Validate permissions before returning sensitive data
- **Frontend (React)**: Show/hide buttons, links, or features based on access
- **Shared TypeScript**: Avoid duplication and keep logic consistent

## Part 2: Tutorial - ABAC in Practice with the BHVR Stack

### 🧰 Prerequisites

- Bun installed https://bun.sh/docs/installation
- SQLite available (optional: Drizzle can embed it)
- Basic knowledge of TypeScript and React

### 🏗️ Step 1 - Setup Project Structure

\`\`\`bash
mkdir bhvr-abac
cd bhvr-abac
bun init -y
mkdir -p apps/api apps/web packages/shared
\`\`\`

We're following a **monorepo** layout using Bun as the toolchain.

### 🔧 Step 2 - Backend with Bun, Hono and Drizzle

\`\`\`bash
cd apps/api
bun add hono drizzle-orm drizzle-kit zod
bun add -D drizzle-kit
\`\`\`

Create a \`tsconfig.json\` in \`apps/api\`:

\`\`\`json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "types": ["bun-types"]
  }
}
\`\`\`

Create your schema:

\`\`\`tsx
// apps/api/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  role: text("role").notNull(), // admin, editor, viewer
  department: text("department")
});

export const postsTable = sqliteTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  ownerId: text("owner_id").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).default(false)
});
\`\`\`

Generate migrations:

\`\`\`bash
bunx drizzle-kit generate:sqlite --schema=./schema.ts
\`\`\`

### 🔐 Step 3 - Create the ABAC Logic (Shared)

\`\`\`tsx
// packages/shared/auth/abac.ts
export type User = {
  id: string;
  role: "admin" | "editor" | "viewer";
  department?: string;
};

export type Resource = {
  ownerId: string;
  isPublished: boolean;
};

export type Action = "read" | "edit" | "delete" | "publish";

export function can(user: User, action: Action, resource: Resource): boolean {
  if (user.role === "admin") return true;

  if (user.role === "editor") {
    if (action === "read") return resource.isPublished || resource.ownerId === user.id;
    if (action === "edit" || action === "delete") return resource.ownerId === user.id;
    if (action === "publish") return resource.ownerId === user.id;
  }

  if (user.role === "viewer") {
    return action === "read" && resource.isPublished;
  }

  return false;
}
\`\`\`

You can import this logic in both backend and frontend.

### 🛡️ Step 4 - Protect Hono API Routes

\`\`\`tsx
// apps/api/routes/posts.ts
import { Hono } from 'hono';
import { can } from '../../../packages/shared/auth/abac';
import { db } from '../db';

const postsRoute = new Hono();

postsRoute.get('/:id', async (c) => {
  const user = c.get('user'); // assume user is set by auth middleware
  const id = c.req.param('id');
  const post = await db.query.posts.findFirst({ where: (p) => p.id.eq(id) });

  if (!post || !can(user, 'read', post)) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  return c.json(post);
});
\`\`\`

### 🖼️ Step 5 - React Frontend with Conditional UI

\`\`\`bash
cd apps/web
bun create vite . --template react-ts
bun install
\`\`\`

Then:

\`\`\`tsx
// apps/web/src/components/PostActions.tsx
import { can, User, Resource } from '@shared/auth/abac';

export function PostActions({ user, post }: { user: User; post: Resource }) {
  return (
    <div>
      {can(user, 'edit', post) && <button>Edit</button>}
      {can(user, 'delete', post) && <button>Delete</button>}
      {can(user, 'publish', post) && <button>Publish</button>}
    </div>
  );
}
\`\`\`

This ensures the UI only shows actions that the user is allowed to perform.

### 🧪 Step 6 - Write Simple Tests

\`\`\`tsx
// packages/shared/auth/abac.test.ts
import { can } from './abac';

const user = { id: 'u1', role: 'editor' };
const post = { ownerId: 'u1', isPublished: false };

console.assert(can(user, 'edit', post), 'Editor should edit their own post');
console.assert(!can(user, 'delete', { ...post, ownerId: 'u2' }), 'Editor should not delete others' posts');
\`\`\`

Run it:

\`\`\`bash
bun run abac.test.ts
\`\`\`

## ✅ Conclusion

By separating the **concepts** (ABAC) from the **implementation** (BHVR + Drizzle + React), you now have:

- A maintainable and scalable access control system
- Logic enforced across both API and UI layers
- A project scaffold ready to grow with your needs

## 🧭 What's Next?

- Store dynamic ABAC rules in your database
- Build a full admin interface for user/role management
- Integrate session-based auth and tenant isolation
- Add real-world testing using Vitest or Playwright
`,
    readTime: 10,
    tags: ["ABAC", "BHVR Stack", "Authorization"],
    author: "Gabriel Halus",
  },
];
