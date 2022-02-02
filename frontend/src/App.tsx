import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './views/Register';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Book from './views/Book';
import "./styles/main.scss";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book" element={<Book />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
