---
title: "Construire des APIs Type-Safe avec TypeScript et Zod"
excerpt: "Apprenez a creer des contrats d'API infaillibles en combinant le systeme de types TypeScript avec la validation runtime via les schemas Zod."
date: "2025-01-15"
readingTime: "8 min"
category: "Ingenierie"
tags:
  - TypeScript
  - Zod
  - API Design
  - Type Safety
pinned: true
order: 1
---

La securite des types a la compilation est excellente, mais qu'en est-il du runtime ? Lorsque les donnees traversent les frontieres du systeme - reponses API, entrees de formulaires ou services externes - les garanties de TypeScript disparaissent. C'est la que Zod devient inestimable.

## Le Probleme de la Confiance

Considerez un appel API typique :

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const user = await fetch('/api/user').then(r => r.json()) as User;
```

Ce `as User` est un **mensonge**. Nous disons a TypeScript de faire confiance au fait que la reponse correspond a notre interface, mais nous n'avons aucune garantie runtime. Si l'API retourne `{ id: 123 }` au lieu de `{ id: "123" }`, TypeScript ne nous sauvera pas.

## Entrez Zod

Zod est une bibliotheque de validation de schemas TypeScript-first. Elle permet de definir des schemas qui servent a la fois de validateurs runtime et de sources de types TypeScript :

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;
```

Maintenant nous avons une source unique de verite. Le type `User` est derive du schema, et nous pouvons valider les donnees au runtime :

```typescript
const response = await fetch('/api/user').then(r => r.json());
const user = UserSchema.parse(response); // Lance une erreur si invalide
```

## Construire un Client API Type-Safe

Voici un pattern que j'utilise pour les clients API combinant le meilleur des deux mondes :

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

Cette approche valide les entrees et les sorties, assurant que la securite des types traverse tout le cycle de requete.

## Gestion d'Erreurs Coherente

Les messages d'erreur de Zod sont developer-friendly par defaut, mais vous pouvez les personnaliser :

```typescript
const UserSchema = z.object({
  email: z.string().email({ message: "Format d'email invalide" }),
  age: z.number().min(18, { message: "Doit avoir 18 ans ou plus" }),
});
```

Pour les formulaires utilisateur, cela rend la gestion d'erreurs simple et coherente.

## La Vision Globale

Les APIs type-safe ne sont pas seulement pour attraper les bugs - elles sont une question de **confiance**. Quand vous savez que vos contrats de donnees sont appliques a chaque frontiere, vous pouvez refactorer sans peur. Votre IDE devient plus intelligent. Vos tests deviennent plus simples.

L'investissement initial dans des schemas propres paie des dividendes tout au long de la vie de votre codebase. Commencez petit, validez aux frontieres, et laissez le systeme de types guider votre design.
