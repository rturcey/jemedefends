// frontend/jest.config.mjs
/** @type {import("jest").Config} */
export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy"
  }
};
