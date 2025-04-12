import React, { useState, useEffect } from "react";
import api from "./axiosConfig";
import AuthForm from "./components/AuthForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Chargez les tâches lorsque l'utilisateur se connecte
  useEffect(() => {
    if (token) {
      const fetchTasks = async () => {
        setIsLoading(true);
        try {
          const response = await api.get("/tasks");
          setTasks(response.data);
        } catch (err) {
          console.error("Erreur lors du chargement des tâches:", err);
          
          // Si l'erreur est due à un token expiré ou non valide
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            logout();
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTasks();
    }
  }, [token]);
  
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setTasks([]);
  };
  
  // Si l'utilisateur n'est pas connecté, affichez le formulaire de connexion
  if (!token) {
    return (
      <div className="app-container">
        <div className="auth-container">
          <h1>Ma To-Do List</h1>
          <AuthForm setToken={setToken} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="app-container">
      <div className="todo-container">
        <header>
          <h1>Ma To-Do List</h1>
          <button onClick={logout} className="logout-button">
            Déconnexion
          </button>
        </header>
        
        <TaskForm setTasks={setTasks} />
        
        {isLoading ? (
          <p className="loading">Chargement des tâches...</p>
        ) : (
          <TaskList tasks={tasks} setTasks={setTasks} />
        )}
      </div>
    </div>
  );
}

export default App;