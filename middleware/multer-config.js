const multer = require("multer");

// Configuration de Multer pour le stockage des images
// Définition des types MIME autorisés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Utilisation du stockage en mémoire
const storage = multer.memoryStorage();

// Filtrage des fichiers pour n'accepter que les images
const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) {
    callback(null, true);
  } else {
    callback(new Error("Type de fichier non pris en charge"), false);
  }
};

module.exports = multer({ storage, fileFilter }).single("image");
