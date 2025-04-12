import React, { useState } from "react";
import api from "../axiosConfig";

const TaskForm = ({ setTasks }) => {
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newTask.trim()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Envoyez la nouvelle tâche au serveur
      const res = await api.post("/tasks", { title: newTask });
      
      // Ajoutez la nouvelle tâche à la liste
      setTasks((prevTasks) => [...prevTasks, res.data]);
      
      // Réinitialisez le champ
      setNewTask("");
    } catch (err) {
      console.error("Erreur lors de l'ajout de la tâche:", err);
      alert("Erreur lors de l'ajout de la tâche");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nouvelle tâche"
        disabled={isLoading}
        required
      />
      
      <button 
        type="submit" 
        disabled={isLoading || !newTask.trim()}
      >
        {isLoading ? "Ajout..." : "Ajouter"}
      </button>
    </form>
  );
};

export default TaskForm;