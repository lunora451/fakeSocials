const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token non fourni" });
  }

  try {
    // Vérification et décryptage du JWT
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Vérification de l'expiration du JWT
    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: "Token expiré" });
    }
    next();
  } catch (error) {
    console.error("Erreur de vérification du JWT :", error);
    return res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = verifyToken;
