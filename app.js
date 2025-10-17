const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/Book");
const bookRoutes = require("./routes/Book");
const userRoutes = require("./routes/User");
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

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
