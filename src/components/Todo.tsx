import { useState, useEffect } from 'react';
import type { Todo } from '../types/todo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const remaining = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      toast.error('Please enter a task!');
      return;
    }
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date()
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
    toast.success('Task added successfully!');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    toast.info('Task status updated!');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.success('Task deleted successfully!');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen p-4 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Todo App</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg">{currentTime}</span>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Task
          </button>
        </form>

        <div className="mb-4">
          <p className="text-lg font-semibold">{remaining} tasks remaining</p>
        </div>

        <div className="space-y-2">
          {todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-5 h-5 rounded"
                />
                <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 text-red-500 hover:bg-red-100 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer position="bottom-right" theme={isDarkMode ? 'dark' : 'light'} />
    </div>
  );
} 