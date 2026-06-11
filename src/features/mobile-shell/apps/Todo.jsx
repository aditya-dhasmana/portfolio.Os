import { useMemo, useState } from "react";
import { Check, Circle, Plus, Trash2 } from "lucide-react";

import { useTodos } from "../data/todos";

const FILTERS = ["all", "active", "done"];

const TodoApp = () => {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const { todos, stats, addTodo, toggleTodo, deleteTodo } = useTodos();

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((todo) => !todo.completed);
    if (filter === "done") return todos.filter((todo) => todo.completed);
    return todos;
  }, [filter, todos]);

  const handleSubmit = (event) => {
    event.preventDefault();
    addTodo(text);
    setText("");
  };

  return (
    <div className="mobile-page todo-app">
      <section className="todo-hero">
        <p>Today</p>
        <h1>{stats.active} tasks left</h1>
        <span>
          {stats.completed} of {stats.total} complete
        </span>
      </section>

      <form className="todo-compose" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a task"
        />
        <button type="submit" aria-label="Add task">
          <Plus size={19} />
        </button>
      </form>

      <div className="todo-filters" role="tablist" aria-label="Todo filters">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="todo-list">
        {visibleTodos.length === 0 && (
          <div className="mobile-empty-state">Nothing here yet.</div>
        )}
        {visibleTodos.map((todo) => (
          <div key={todo.id} className={todo.completed ? "todo-row done" : "todo-row"}>
            <button type="button" onClick={() => toggleTodo(todo.id)} aria-label="Toggle task">
              {todo.completed ? <Check size={17} /> : <Circle size={17} />}
            </button>
            <span>{todo.text}</span>
            <button type="button" onClick={() => deleteTodo(todo.id)} aria-label="Delete task">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
