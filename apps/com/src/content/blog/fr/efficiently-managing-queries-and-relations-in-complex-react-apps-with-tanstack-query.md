---

title: "Efficiently Managing Queries and Relations in Complex React Apps with TanStack Query"
excerpt: "After years with Node.js, I made the leap to Bun. Here's what changed, what broke, and why I'm not looking back."
date: "2026-01-28"
readingTime: "6 min read"
category: "Fullstack"
tags:
  - "TypeScript"
  - "API"
pinned: true
order: 1

---

Building complex React apps requires efficient data fetching, caching, and mapping — especially when users have multiple relational data like roles, permissions, or groups. **TanStack Query (React Query)** is excellent for this, but without proper structure, you quickly run into **N+1 requests**, stale caches, and unmaintainable code.

This post covers **best practices for queries, mutations, and relations**, with concrete examples for scalable frontend patterns.

---

## 1. Organize Queries and Mutations

Separate concerns clearly:

```
src/
  api/
    users/
      queries.ts       // fetchUsers, fetchUserById
      mutations.ts     // createUser, updateUser
      types.ts
      keys.ts          // query key builders
  hooks/
    users/
      usePaginatedUsers.ts
      useUsersRelations.ts
```

- **API layer** handles network requests and errors.
- **Hooks layer** wraps `useQuery`/`useMutation`, handles caching, invalidation, and TypeScript types.
- Centralize **query keys** for predictable caching and invalidation.

---

## 2. Parametric, Typed Query Keys

Avoid hardcoding query keys. Use functions:

```ts
export const usersKeys = {
  paginated: (page: number, pageSize: number) => ["users", "paginated", page, pageSize] as const,
  relations: (userIds: string[], include: UserRelationKey[]) =>
    ["users", "relations", { userIds, include }] as const,
  relationCounts: (userIds: string[], include: UserRelationKey[]) =>
    ["users", "relations", "count", { userIds, include }] as const,
};
```

- Fully type-safe.
- Works with **single or multiple users**.
- Supports **dynamic relations** (roles, permissions, etc.).

---

## 3. Generic Relations Endpoints

Instead of one endpoint per relation:

- `/users/:id/roles`
- `/users/:id/roles/count`
- `/users/roles`
- `/users/roles/count`

Use **generic endpoints**:

```ts
// Fetch relations for one or more users
GET /users/relations?userIds=1,2,3&include=roles,permissions

// Fetch relation counts
GET /users/relations/count?userIds=1,2,3&include=roles,permissions
```

- Accepts **single or multiple user IDs**.
- Accepts **any combination of relations**.
- Supports batching, reduces N+1 requests, and keeps API surface minimal.

---

## 4. Batched Hooks

```ts
export const useUsersRelations = (userIds: string[], include: UserRelationKey[]) =>
  useQuery(
    usersKeys.relations(userIds, include),
    () => fetchUsersRelations(userIds, include)
  );

export const useUsersRelationCounts = (userIds: string[], include: UserRelationKey[]) =>
  useQuery(
    usersKeys.relationCounts(userIds, include),
    () => fetchUsersRelationCounts(userIds, include)
  );
```

- Works for **single-user or multi-user queries**.
- Reduces network requests drastically while keeping **independent caching**.

---

## 5. Mapping Relations in the Frontend

Assume the API returns data keyed by user ID:

```ts
{
  "1": { roles: 3, permissions: 5 },
  "2": { roles: 1, permissions: 2 }
}
```

Use it in your UI:

```tsx
const UsersTable = () => {
  const { data: paginatedUsers } = usePaginatedUsers({ page: 1, pageSize: 20 });
  const userIds = paginatedUsers?.data.map(u => u.id) ?? [];
  const include: UserRelationKey[] = ["roles", "permissions"];
  const { data: relationCounts } = useUsersRelationCounts(userIds, include);

  return (
    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Roles</th>
          <th>Permissions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedUsers?.data.map((user) => {
          const counts = relationCounts?.[user.id];
          return (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{counts?.roles ?? "..."}</td>
              <td>{counts?.permissions ?? "..."}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
```

- Batch queries per page.
- Map relation data using `user.id` as the key.
- Minimal requests, high performance.

---

## 6. Pagination and Caching

```ts
useQuery(usersKeys.paginated(page, pageSize), fetchUsers, {
  keepPreviousData: true,
  staleTime: 60000,
});
```

- `keepPreviousData` → smooth page transitions.
- `staleTime` → avoid unnecessary refetches.
- Query keys include **page and filters** for separate caches.

---

## 7. Refetching Relations Independently

```ts
queryClient.invalidateQueries({
  queryKey: ["users", "relations", "count", { userIds: [userId], include: ["roles"] }],
  exact: false,
});
```

- Only the specified user + relation is refetched.
- Works even with batched endpoints.

---

## 8. Best Practices Summary

1. **Organize by feature**: separate API and hooks.
2. **Use parametric query keys** for pagination and relations.
3. **Batch relation queries** to avoid N+1 requests.
4. **Map relation data by user ID** for clean UI integration.
5. **Invalidate selectively** after mutations.
6. **Keep hooks flexible**: single-user or multi-user support.
7. **Use TypeScript** for safe API contracts and query keys.

---

## Conclusion

By using **generic endpoints, parametric keys, and batched hooks**, you can efficiently handle **users and their dynamic relations** in large React apps. This ensures **minimal network requests, scalable caching, and maintainable code**, whether you’re fetching one user or hundreds.

This pattern scales elegantly for enterprise dashboards with **multiple relations per user** and **paginated datasets**, keeping your frontend fast and predictable.
