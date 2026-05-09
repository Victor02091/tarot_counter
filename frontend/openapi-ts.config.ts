import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:8000/openapi.json",
  output: "src/api",
  plugins: [
    "@hey-api/client-fetch",
    "@hey-api/typescript",
    {
      name: "@hey-api/sdk",
      // single strategy generates functions like we are using currently
      // byTags strategy would group them by FastAPI tags
    },
  ],
});
