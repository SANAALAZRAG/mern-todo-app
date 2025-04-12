import React, { useState } from "react";
import api from "../axiosConfig";

const AuthForm = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, { email, password });
      
      if (isLogin) {
        // Stockez le token et mettez à jour l'état
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      } else {
        // Inscription réussie, passez à la connexion
        alert("Inscription réussie, connectez-vous !");
        setIsLogin(true);
      }
      
      // Réinitialisez les champs
      setEmail("");
      setPassword("");
      
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur s'est produite");
    }
  };
  
  return (
    <div className="auth-form">
      <h2>{isLogin ? "Connexion" : "Inscription"}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        
        <button type="submit" className="primary-button">
          {isLogin ? "Se connecter" : "S'inscrire"}
        </button>
      </form>
      
      <button 
        onClick={() => setIsLogin(!isLogin)} 
        className="toggle-auth-button"
      >
        {isLogin 
          ? "Pas de compte ? Inscrivez-vous" 
          : "Déjà un compte ? Connectez-vous"}
      </button>
    </div>
  );
};

export default AuthForm;