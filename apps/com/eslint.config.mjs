import createConfig from "@gabrielhalus/eslint-config/create-config";

export default createConfig(
  {
    react: true,
    next: true, // Add Next.js support
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
      "@tanstack/query/exhaustive-deps": "error",
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md", "~__root.tsx"],
        },
      ],
      // Next.js specific rules
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-unwanted-polyfillio": "error",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-css-tags": "error",
      "@next/next/no-head-element": "error",
      "@next/next/no-typos": "error",
      "@next/next/no-duplicate-head": "error",
      "@next/next/no-before-interactive-script-outside-document": "error",
      "@next/next/no-title-in-document-head": "error",
      "@next/next/no-document-import-in-page": "error",
      "@next/next/no-head-import-in-page": "error",
      "@next/next/no-script-component-in-head": "error",
      "@next/next/no-styled-jsx-in-document": "error",
      "@next/next/no-unwanted-polyfillio": "error",
    },
  },
);
