# Tarot counter Frontend

This is the frontend of the Tarot game result counter app, built with **React**, **TypeScript**, and **Vite**.

## 🛠️ Getting Started

### 1. Install dependencies

Make sure you're in the `frontend` directory, then run:

```bash
npm install
```

### 2. Run the development server

Start the app with:

```bash
npm run dev
```

By default, this will start the app at: [http://localhost:5173](http://localhost:5173)

### 3. Generate API Client

The project uses [@hey-api/openapi-ts](https://hey-api.dev/) to automatically generate a typed TypeScript client from the FastAPI backend.

To update the client when the backend changes:

```bash
npm run generate-api
```

The client is generated in `src/api/` using the modern bundled fetch client.
