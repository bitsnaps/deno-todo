const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const todos = ref([]);
    const newTitle = ref("");
    const filter = ref("all");

    // Fetch all todos
    async function fetchTodos() {
      const res = await fetch("/api/todos");
      todos.value = await res.json();
    }

    // Add a new todo
    async function addTodo() {
      const title = newTitle.value.trim();
      if (!title) return;
      await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      newTitle.value = "";
      await fetchTodos();
    }

    // Toggle completed
    async function toggle(todo) {
      await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });
      await fetchTodos();
    }

    // Delete
    async function remove(id) {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      await fetchTodos();
    }

    // Computed
    const remaining = computed(
      () => todos.value.filter((t) => !t.completed).length,
    );
    const completed = computed(
      () => todos.value.filter((t) => t.completed).length,
    );
    const filtered = computed(() => {
      if (filter.value === "active")
        return todos.value.filter((t) => !t.completed);
      if (filter.value === "done")
        return todos.value.filter((t) => t.completed);
      return todos.value;
    });

    onMounted(fetchTodos);

    return {
      todos,
      newTitle,
      filter,
      filtered,
      remaining,
      completed,
      addTodo,
      toggle,
      remove,
    };
  },
}).mount("#app");
