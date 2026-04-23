import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;

    if (editId) {
      setTasks(
        tasks.map((t) =>
          t.id === editId ? { ...t, text: task } : t
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        { id: Date.now(), text: task, done: false }
      ]);
    }

    setTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const startEdit = (t) => {
    setTask(t.text);
    setEditId(t.id);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.done;
    if (filter === "pending") return !t.done;
    return true;
  });

  return (
    <div className="app">
      <h1>Rafia's ToDo App</h1>

      <div className="inputBox">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task..."
        />
        <button onClick={addTask}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Done</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <p className="count">
        Total: {tasks.length} | Done: {tasks.filter(t => t.done).length}
      </p>

      <div className="list">
        {filteredTasks.map((t) => (
          <div key={t.id} className="item">

            <span
              className={t.done ? "done" : ""}
              onClick={() => toggleTask(t.id)}
            >
              {t.text}
            </span>

            <div>
              <button onClick={() => startEdit(t)}>✏️</button>
              <button onClick={() => deleteTask(t.id)}>❌</button>
            </div>

          </div>
        ))}
      </div>

      {tasks.length === 0 && <p>No tasks yet 🚀</p>}
    </div>
  );
}