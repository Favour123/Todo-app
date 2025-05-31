import { useState, useEffect } from 'react';
import type { Todo } from '../types/todo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SunIcon, MoonIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
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
      todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
    ));
    toast.info('Task status updated!');
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = (id: string) => {
    if (!editValue.trim()) {
      toast.error('Task cannot be empty!');
      return;
    }
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editValue.trim(), updatedAt: new Date() } : todo
    ));
    setEditingId(null);
    setEditValue('');
    toast.success('Task updated successfully!');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.success('Task deleted successfully!');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`min-h-screen p-4 transition-colors duration-500 ease-in-out ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="max-w-2xl mx-auto">
        <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300 animate-gradient">
              Todo App
            </h1>
            <div className={`hidden sm:flex items-center justify-center px-3 py-1 text-sm rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <span className="animate-pulse">{todos.length} tasks</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-200' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <span className="text-sm sm:text-base font-medium hidden sm:inline">Current time:</span>
              <span className="text-sm sm:text-base tabular-nums">{currentTime}</span>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 sm:p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 transition-all duration-300 transform hover:rotate-90" />
              ) : (
                <MoonIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 transition-all duration-300 transform hover:-rotate-90" />
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
            className={`flex-1 px-4 py-3 rounded-lg border-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              isDarkMode 
              ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' 
              : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Task
          </button>
        </form>

        <div className={`mb-4 p-4 rounded-lg transition-all duration-300 transform hover:scale-102 ${
          isDarkMode 
          ? 'bg-gray-800 text-blue-400' 
          : 'bg-white text-blue-500'
        } shadow-md hover:shadow-lg`}>
          <p className="text-lg font-semibold flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
              isDarkMode 
              ? 'bg-gray-700 text-blue-400' 
              : 'bg-blue-100 text-blue-500'
            }`}>
              {remaining}
            </span>
            <span>tasks remaining</span>
          </p>
        </div>

        <div className="space-y-3">
          {todos.map(todo => (
            <div
              key={todo.id}
              className={`p-4 rounded-lg transition-all duration-300 transform hover:scale-101 ${
                isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-750' 
                : 'bg-white hover:bg-gray-50'
              } shadow-md hover:shadow-lg`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className={`w-5 h-5 rounded border-2 transition-all duration-300 
                        ${isDarkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-white border-gray-300'
                        } 
                        checked:bg-blue-500 checked:border-blue-500 focus:ring-1 focus:ring-offset-2 focus:ring-blue-500`}
                    />
                  </div>
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className={`flex-1 px-3 py-1 rounded  transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                        isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' 
                        : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1">
                      <span className={`transition-all duration-300 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.text}
                      </span>
                      <div className={`text-xs mt-1 transition-all duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Created: {formatDate(todo.createdAt)}
                        {todo.updatedAt && ` • Updated: ${formatDate(todo.updatedAt)}`}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingId === todo.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                          isDarkMode 
                          ? 'text-green-400 hover:bg-gray-700' 
                          : 'text-green-500 hover:bg-green-100'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                          isDarkMode 
                          ? 'text-red-400 hover:bg-gray-700' 
                          : 'text-red-500 hover:bg-red-100'
                        }`}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(todo)}
                        className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                          isDarkMode 
                          ? 'text-blue-400 hover:bg-gray-700' 
                          : 'text-blue-500 hover:bg-blue-100'
                        }`}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                          isDarkMode 
                          ? 'text-red-400 hover:bg-gray-700' 
                          : 'text-red-500 hover:bg-red-100'
                        }`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer 
        position="bottom-right" 
        theme={isDarkMode ? 'dark' : 'light'}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="transition-all duration-300"
      />
    </div>
  );
} 