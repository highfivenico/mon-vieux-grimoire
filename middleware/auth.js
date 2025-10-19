const jwt = require("jsonwebtoken");

// Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    // Extraction et vérification du token JWT
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
