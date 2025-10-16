const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Coller ici le code de connexion à MongoDB

// Middleware pour parser le JSON des requêtes entrantes
app.use(express.json());

// Middleware pour gérer les CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/books", (req, res, next) => {
  const book = req.body;
  res.status(201).json({ message: "Livre ajouté avec succès." });
});

app.get("/api/books", (req, res, next) => {
  res.status(200).json({ message: "Livres récupérés avec succès." });
});

module.exports = app;
