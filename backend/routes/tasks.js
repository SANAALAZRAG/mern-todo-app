const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Récupérer toutes les tâches de l'utilisateur connecté
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Ajouter une nouvelle tâche
router.post("/", auth, async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: "Le titre est requis" });
    }
    
    const task = new Task({
      title,
      user: req.user.id
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer une tâche
router.delete("/:id", auth, async (req, res) => {
  try {
    // Vérifiez si la tâche existe et appartient à l'utilisateur
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée ou non autorisée" });
    }
    
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
});

// Mettre à jour une tâche (marquer comme complète ou incomplète)
router.put("/:id", auth, async (req, res) => {
  try {
    const { completed } = req.body;
    
    // Vérifiez si la tâche existe et appartient à l'utilisateur
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée ou non autorisée" });
    }
    
    // Mettre à jour le statut de la tâche
    task.completed = completed;
    await task.save();
    
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
});

module.exports = router;