// import { defineConfig, mergeConfig } from "vitest/config";
// import viteConfig from "./vite.config";

// export default mergeConfig(
//   viteConfig,
//   defineConfig({
//     test: {
//       globals: true,
//       environment: "jsdom",
//       setupFiles: "./src/test/setup.ts",
//       css: true,
//       clearMocks: true,
//       restoreMocks: true,
//       mockReset: true,
//       coverage: {
//         provider: "v8",
//         reporter: ["text", "html", "json"],
//         reportsDirectory: "./coverage",
//         exclude: [
//           "src/main.tsx",
//           "src/vite-env.d.ts",
//           "src/assets/**",
//           "src/types/**",
//           "src/test/**",
//         ],
//       },
//     },
//   }),
// );

import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      css: true,
      clearMocks: true,
      restoreMocks: true,
      mockReset: true,

      coverage: {
        provider: "v8",

        reporter: ["text", "html", "json"],

        reportsDirectory: "./coverage",

        // Include all source files in coverage,
        // even if they are not imported by a test.
        include: ["src/**/*.{ts,tsx}"],

        exclude: [
          "src/main.tsx",
          "src/vite-env.d.ts",
          "src/assets/**",
          "src/types/**",
          "src/test/**",
        ],
      },
    },
  }),
);
