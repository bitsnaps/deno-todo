# 📋 Deno Todo App

A full-stack Todo app built with **Deno** (backend) and **Vue 3** (frontend), deployed to [Deno Deploy](https://deno.com/deploy).

**🔗 Live:** [deno-todo-app.deno.dev](https://deno-todo-app.deno.dev)

## Stack

| Layer | Tech |
|-------|------|
| Runtime | [Deno](https://deno.com) 2.x |
| Backend | Native HTTP server (`Deno.serve`) |
| Frontend | [Vue 3](https://vuejs.org) via CDN (no build step) |
| Styling | Hand-rolled dark theme (Slate palette) |
| Deploy | [Deno Deploy](https://deno.com/deploy) via `deployctl` |

## Features

- **CRUD API** — Full REST JSON endpoint at `/api/todos`
- **Single-file frontend** — Vue 3 SPA with add, toggle, delete, and filter (All / Active / Done)
- **Dark theme** — Clean slate-blue UI, no framework needed
- **Zero build step** — Vue loaded from CDN, no bundler, no `node_modules`
- **CORS-ready** — Pre-configured headers for cross-origin access

## API

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `GET` | `/api/todos` | List all todos | — |
| `POST` | `/api/todos` | Create a todo | `{ "title": "string" }` |
| `PUT` | `/api/todos/:id` | Update a todo | `{ "title"?, "completed"? }` |
| `DELETE` | `/api/todos/:id` | Delete a todo | — |

All responses are JSON. IDs are 8-char UUIDs.

## Project Structure

```
deno-todo/
├── main.ts          # Backend: REST API + static file server
├── static/
│   └── index.html   # Frontend: Vue 3 SPA
├── deno.json        # Deno config (tasks, deploy settings)
└── main_test.ts     # Starter test placeholder
```

## Run Locally

```bash
# Install Deno: https://docs.deno.com/runtime/getting_started/installation

# Start the dev server (with hot-reload)
deno task dev

# Or start without watch
deno task start
```

Open [http://localhost:8000](http://localhost:8000).

## Deploy

```bash
# Install deployctl
deno install -g -A -r jsr:@deno/deployctl

# Deploy (preview)
deployctl deploy --project=deno-todo-app --entrypoint=main.ts

# Deploy (production)
deployctl deploy --project=deno-todo-app --entrypoint=main.ts --prod
```

## License

MIT
