const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "Accès refusé" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "votre_secret_jwt");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = auth;