import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then(res => setTodos(res.data));
  }, []);

  const addTodo = () => {
    axios.post('http://localhost:5000/todos', { title: input })
      .then(res => setTodos([...todos, res.data]));
    setInput('');
  };

  const toggleTodo = (id, completed) => {
    axios.put(`http://localhost:5000/todos/${id}`, { completed: !completed })
      .then(res => {
        setTodos(todos.map(todo => todo._id === id ? res.data : todo));
      });
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      });
  };

  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Todo Summary Assistant</h1>
      <div className="mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add todo"
          className="border p-2 rounded mr-2" />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>
      <ul className="w-full max-w-md space-y-2">
        {todos.map(todo => (
          <li key={todo._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <span
              onClick={() => toggleTodo(todo._id, todo.completed)}
              className={todo.completed ? 'line-through' : ''}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo._id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <p>Total: {total}</p>
        <p>Completed: {completed}</p>
        <p>Pending: {pending}</p>
      </div>
    </div>
  );
}

export default App;
