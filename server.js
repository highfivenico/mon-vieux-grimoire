// Importe le module 'http' de Node.js pour créer un serveur HTTP et l'application Express définie dans 'app.js'
const http = require("http");
const app = require("./app");

// Fonction pour s'assurer que le port est valide
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Détermine le port à utiliser
const port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

// Fonction de gestion des erreurs liées au serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;

  // Gère les différents types d’erreurs courantes au démarrage du serveur
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Crée le serveur HTTP en lui passant l'app Express
const server = http.createServer(app);

// Attache la fonction de gestion des erreurs à l'événement 'error' du serveur
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Démarre le serveur en écoutant sur le port défini
server.listen(port);
