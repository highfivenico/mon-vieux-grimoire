const sharp = require("sharp");
const path = require("path");

// Fonction pour traiter et enregistrer une image
const processImage = async (file) => {
  // Génération d'un nom de fichier unique
  const originalName = file.originalname
    .split(" ")
    .join("_")
    .replace(/\.[^.]+$/, "");
  const uniqueFileName = `${originalName}_${Date.now()}.webp`;
  const imagePath = path.join("images", uniqueFileName);

  // Redimensionnement et conversion de l'image en WebP
  await sharp(file.buffer)
    .resize({ width: 463 })
    .toFormat("webp")
    .toFile(imagePath);

  return uniqueFileName;
};

module.exports = { processImage };
