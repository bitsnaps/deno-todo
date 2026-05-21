// ── Todo App — Deno Backend ───────────────────────────────────
// Full-stack Todo app: REST JSON API + Vue 3 SPA frontend

import { serveDir } from "jsr:@std/http/file-server";

// ── Types & Store ─────────────────────────────────────────────
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

const todos: Todo[] = [];

// ── Helpers ───────────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function extractId(pathname: string): string | null {
  const m = pathname.match(/^\/api\/todos\/([a-z0-9]+)$/);
  return m ? m[1] : null;
}

// ── API Handlers ──────────────────────────────────────────────
async function handleTodos(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url);
  const method = req.method;

  // GET /api/todos
  if (method === "GET" && pathname === "/api/todos") {
    return json(todos);
  }

  // POST /api/todos
  if (method === "POST" && pathname === "/api/todos") {
    const body = await req.json() as { title?: string };
    const title = body.title?.trim();
    if (!title) return json({ error: "title is required" }, 400);
    const todo: Todo = {
      id: crypto.randomUUID().slice(0, 8),
      title,
      completed: false,
      createdAt: Date.now(),
    };
    todos.push(todo);
    return json(todo, 201);
  }

  // PUT /api/todos/:id
  if (method === "PUT") {
    const id = extractId(pathname);
    if (!id) return json({ error: "not found" }, 404);
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) return json({ error: "not found" }, 404);
    const body = await req.json() as { title?: string; completed?: boolean };
    if (body.title !== undefined) todos[idx].title = body.title;
    if (body.completed !== undefined) todos[idx].completed = body.completed;
    return json(todos[idx]);
  }

  // DELETE /api/todos/:id
  if (method === "DELETE") {
    const id = extractId(pathname);
    if (!id) return json({ error: "not found" }, 404);
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) return json({ error: "not found" }, 404);
    todos.splice(idx, 1);
    return json({ ok: true });
  }

  return json({ error: "not found" }, 404);
}

// ── Main Server ───────────────────────────────────────────────
Deno.serve({ port: 8000 }, async (req: Request) => {
  const { pathname } = new URL(req.url);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  // API routes
  if (pathname.startsWith("/api/")) {
    return handleTodos(req);
  }

  // Serve Vue frontend (static files)
  return serveDir(req, {
    fsRoot: "./static",
    urlRoot: "",
  });
});
