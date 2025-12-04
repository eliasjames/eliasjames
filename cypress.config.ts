import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: false,
  },
  env: {
    // set this value in cypress.env.json (which is .gitignored)
    // use the same value as .env for the local server
    // use a strong random value:
    // run `$ openssl rand -base64 32` (or similar) on the command line
    INSECURE_TESTING_PASSWORD: "",
  },
});
