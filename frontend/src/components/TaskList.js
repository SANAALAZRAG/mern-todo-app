import React from "react";
import api from "../axiosConfig";

const TaskList = ({ tasks, setTasks }) => {
  const deleteTask = async (id) => {
    if (!id) {
      console.error("ID de tâche invalide");
      return;
    }
    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      return;
    }
    
    try {
      await api.delete(`/tasks/${id}`);
      
      // Mettre à jour la liste des tâches en supprimant celle avec l'ID correspondant
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };
  
  const toggleTaskCompletion = async (task) => {
    try {
      const updatedTask = await api.put(`/tasks/${task._id}`, {
        completed: !task.completed
      });
      
      // Mettre à jour la liste des tâches avec la tâche modifiée
      setTasks((prevTasks) => 
        prevTasks.map((t) => 
          t._id === task._id ? updatedTask.data : t
        )
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      alert("Erreur lors de la mise à jour de la tâche");
    }
  };
  
  // Si aucune tâche n'est disponible
  if (tasks.length === 0) {
    return <p className="no-tasks">Aucune tâche pour le moment.</p>;
  }
  
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className={task.completed ? "completed" : ""}>
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task)}
            />
            <span>{task.title}</span>
          </div>
          
          <button 
            onClick={() => deleteTask(task._id)}
            className="delete-button"
          >
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;