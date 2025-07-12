import antfu from "@antfu/eslint-config";

export default async function createConfig(options, ...userConfigs) {
  const config = {
    type: "app",
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
      braceStyle: "1tbs",
    },
    ...options,
  };

  // If Next.js is enabled, add the plugin
  if (options.next) {
    const nextPlugin = await import("@next/eslint-plugin-next");
    config.plugins = {
      ...config.plugins,
      "@next/next": nextPlugin.default,
    };
  }

  return antfu(
    config,
    {
      rules: {
        "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
        "ts/consistent-type-definitions": ["error", "type"],
        "no-console": ["warn"],
        "antfu/no-top-level-await": ["off"],
        "node/prefer-global/process": ["off"],
        "node/no-process-env": ["error"],
        "perfectionist/sort-imports": [
          "error",
          {
            tsconfigRootDir: ".",
          },
        ],
        "unicorn/filename-case": [
          "error",
          {
            case: "kebabCase",
            ignore: ["README.md"],
          },
        ],
      },
    },
    ...userConfigs,
  );
}
