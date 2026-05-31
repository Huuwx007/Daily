import { useState } from "react";
import { Plus, Trash2, Check, Edit2, Save } from "lucide-react";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
}

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high: "bg-red-100 text-red-800 border-red-300",
};

export function TodoListPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
  const [newCategory, setNewCategory] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          priority: newPriority,
          category: newCategory || "General",
        },
      ]);
      setNewTodo("");
      setNewCategory("");
      setNewPriority("medium");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id: number) => {
    if (editText.trim()) {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo)));
    }
    setEditingId(null);
    setEditText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const categories = Array.from(new Set(todos.map((todo) => todo.category)));
  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-8 text-white">
            <h1 className="text-4xl mb-2">My Tasks</h1>
            <p className="opacity-90">Organize and track your todos</p>
            <div className="flex space-x-6 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-2xl">{stats.total}</div>
                <div className="text-sm opacity-90">Total</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-2xl">{stats.active}</div>
                <div className="text-sm opacity-90">Active</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-2xl">{stats.completed}</div>
                <div className="text-sm opacity-90">Completed</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                  placeholder="What needs to be done?"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={addTodo}
                  className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus size={24} />
                  <span>Add</span>
                </button>
              </div>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category (optional)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as "low" | "medium" | "high")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === "all"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  All ({todos.length})
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === "active"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Active ({stats.active})
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === "completed"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Completed ({stats.completed})
                </button>
              </div>
              {categories.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Categories:</span>
                  <div className="flex space-x-2">
                    {categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-auto">
              {filteredTodos.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  {filter === "all" && "No tasks yet. Add one above!"}
                  {filter === "active" && "No active tasks. Great job!"}
                  {filter === "completed" && "No completed tasks yet."}
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        todo.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 hover:border-indigo-500"
                      }`}
                    >
                      {todo.completed && <Check size={16} className="text-white" />}
                    </button>
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && saveEdit(todo.id)}
                        className="flex-1 px-3 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                    ) : (
                      <span className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}>
                        {todo.text}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs border ${priorityColors[todo.priority]}`}>
                      {todo.priority}
                    </span>
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                      {todo.category}
                    </span>
                    {editingId === todo.id ? (
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        <Save size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(todo.id, todo.text)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {stats.completed > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setTodos(todos.filter((todo) => !todo.completed))}
                  className="text-red-500 hover:text-red-600 transition-colors text-sm"
                >
                  Clear {stats.completed} completed task{stats.completed > 1 ? "s" : ""}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
