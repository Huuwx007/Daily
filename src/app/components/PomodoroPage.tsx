import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings, Plus, Trash2, Check } from "lucide-react";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export function PomodoroPage() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setIsWorkTime(!isWorkTime);
      setTimeLeft(isWorkTime ? breakMinutes * 60 : workMinutes * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isWorkTime, workMinutes, breakMinutes]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkTime ? workMinutes * 60 : breakMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const progress = ((isWorkTime ? workMinutes * 60 : breakMinutes * 60) - timeLeft) / (isWorkTime ? workMinutes * 60 : breakMinutes * 60) * 100;

  return (
    <div className="min-h-full bg-gradient-to-br from-red-50 to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl">Pomodoro Timer</h2>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings size={24} />
              </button>
            </div>

            {showSettings && (
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl space-y-4">
                <div>
                  <label className="block mb-2">Work Time (minutes)</label>
                  <input
                    type="number"
                    value={workMinutes}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setWorkMinutes(val);
                      if (isWorkTime && !isRunning) setTimeLeft(val * 60);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <label className="block mb-2">Break Time (minutes)</label>
                  <input
                    type="number"
                    value={breakMinutes}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setBreakMinutes(val);
                      if (!isWorkTime && !isRunning) setTimeLeft(val * 60);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    min="1"
                    max="30"
                  />
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <div className="text-lg mb-4 text-gray-600">
                {isWorkTime ? "Work Time" : "Break Time"}
              </div>
              <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke={isWorkTime ? "#ef4444" : "#10b981"}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleTimer}
                className={`flex items-center space-x-2 px-8 py-4 rounded-xl text-white transition-all ${
                  isWorkTime ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
                <span>{isRunning ? "Pause" : "Start"}</span>
              </button>
              <button
                onClick={resetTimer}
                className="flex items-center space-x-2 px-8 py-4 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
              >
                <RotateCcw size={24} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl mb-6">To-Do List</h2>
            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
              />
              <button
                onClick={addTodo}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-auto">
              {todos.length === 0 ? (
                <div className="text-center text-gray-400 py-12">No tasks yet. Add one above!</div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 hover:border-green-500"
                      }`}
                    >
                      {todo.completed && <Check size={16} className="text-white" />}
                    </button>
                    <span className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}>
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
