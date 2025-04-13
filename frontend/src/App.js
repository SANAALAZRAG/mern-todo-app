import React, { useState, useEffect } from "react";
import api from "./axiosConfig";
import AuthForm from "./components/AuthForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import UserMenu from "./components/UserMenu";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
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
      
      // Si l'utilisateur n'est pas déjà chargé, récupérez ses informations
      if (!user) {
        fetchUserInfo();
      }
      
      fetchTasks();
    }
  }, [token, user]);
  
  const fetchUserInfo = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (err) {
      console.error("Erreur lors de la récupération des informations utilisateur:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
    }
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setTasks([]);
  };
  
  // Si l'utilisateur n'est pas connecté, affichez le formulaire de connexion
  if (!token) {
    return (
    <ThemeProvider>
      <div className="app-container">
        <div className="auth-container">
          <h1>Ma To-Do List</h1>
          <AuthForm setToken={setToken} setUser={setUser} />
        </div>
      </div>
    </ThemeProvider>
  );
  }
  
  return (
    <ThemeProvider>
      <div className="app-container">
        <div className="todo-container">
          <header>
            <h1>Ma To-Do List</h1>
            <UserMenu user={user} logout={logout} />
          </header>
          
          <TaskForm setTasks={setTasks} />
          
          {isLoading ? (
            <p className="loading">Chargement des tâches...</p>
          ) : (
            <TaskList tasks={tasks} setTasks={setTasks} />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;