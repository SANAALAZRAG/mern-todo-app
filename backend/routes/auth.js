const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Inscription
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }
    
    // Hachez le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créez un nouvel utilisateur
    const user = new User({ email, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    
    // Vérifiez le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    
    // Créez un token JWT
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || "votre_secret_jwt", 
      { expiresIn: "1h" }
    );
    
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;