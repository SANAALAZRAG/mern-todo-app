import React, { useState, useRef, useEffect, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const UserMenu = ({ user, logout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  // Fermer le menu lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Extraire l'identifiant utilisateur à partir de l'email
  const getUsername = () => {
    if (!user || !user.email) return "Utilisateur";
    return user.email.split("@")[0];
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      <div 
        className="user-profile" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="user-name">{getUsername()}</span>
        <span className="dropdown-icon">&#9660;</span>
      </div>
      
      {menuOpen && (
        <div className="dropdown-menu">
          <button onClick={toggleDarkMode} className="menu-item">
            {isDarkMode ? "Mode clair" : "Mode sombre"}
          </button>
          <button onClick={logout} className="menu-item">
            Déconnexion
          </button>
          {/* Vous pouvez ajouter d'autres options de menu ici */}
        </div>
      )}
    </div>
  );
};

export default UserMenu;