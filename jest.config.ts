import type { Config } from "jest";

const config: Config = {
  setupFilesAfterEnv: ["./setup-jest.ts"],
  preset: "jest-expo",
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx,js,jsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/expo-env.d.ts",
    "!**/.expo/**",
    "!**/.husky/**",
    "!**/.eslintrc.js",
  ],
  testTimeout: 30000,
};

export default config;
