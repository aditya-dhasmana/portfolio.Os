import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "macfolio.mobile.todos";
const TODOS_EVENT = "macfolio:todos-updated";

const DEFAULT_TODOS = [
  { id: "ship-portfolio", text: "Polish mobile portfolio", completed: false },
  { id: "review-projects", text: "Review project cards", completed: false },
  { id: "share-link", text: "Share resume link", completed: true },
];

const readTodos = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_TODOS;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : DEFAULT_TODOS;
  } catch {
    return DEFAULT_TODOS;
  }
};

const writeTodos = (todos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  window.dispatchEvent(new CustomEvent(TODOS_EVENT, { detail: todos }));
};

export const useTodos = () => {
  const [todos, setTodos] = useState(readTodos);

  useEffect(() => {
    const syncTodos = (event) => {
      setTodos(event.detail || readTodos());
    };

    const syncStorage = () => setTodos(readTodos());

    window.addEventListener(TODOS_EVENT, syncTodos);
    window.addEventListener("storage", syncStorage);

    return () => {
      window.removeEventListener(TODOS_EVENT, syncTodos);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return {
      total: todos.length,
      completed,
      active: todos.length - completed,
    };
  }, [todos]);

  const commit = (updater) => {
    setTodos((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      writeTodos(next);
      return next;
    });
  };

  const addTodo = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    commit((current) => [
      {
        id: `${Date.now()}-${trimmed.toLowerCase().replace(/\s+/g, "-")}`,
        text: trimmed,
        completed: false,
      },
      ...current,
    ]);
  };

  const toggleTodo = (id) => {
    commit((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    commit((current) => current.filter((todo) => todo.id !== id));
  };

  return { todos, stats, addTodo, toggleTodo, deleteTodo };
};
