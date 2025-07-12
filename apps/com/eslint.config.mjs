import createConfig from "@gabrielhalus/eslint-config/create-config";

export default await createConfig(
  {
    react: true,
    next: true,
    ignores: [
      "src/routeTree.gen.ts",
      "src/components/ui",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
    ],
  },
  {
    rules: {
      "antfu/top-level-function": "off",
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md", "~__root.tsx"],
        },
      ],
      // Next.js specific rules
      "@next/next/no-img-element": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-document-import-in-page": "error",
      "@next/next/no-title-in-document-head": "error",
    },
  },
);
