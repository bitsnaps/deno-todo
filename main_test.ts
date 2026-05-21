import { assertEquals } from "@std/assert";
import { Todo } from "./main.ts";

Deno.test(function addTest() {
  const todo = {
    id: "1234",
    title: "test deno app",
    completed: true,
    createdAt: new Date().getTime(),
  } as Todo;
  assertEquals(todo.id, "1234");
});
