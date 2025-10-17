const sharp = require("sharp");
const path = require("path");

const processImage = async (file) => {
  const originalName = file.originalname
    .split(" ")
    .join("_")
    .replace(/\.[^.]+$/, "");
  const uniqueFileName = `${originalName}_${Date.now()}.webp`;
  const imagePath = path.join("images", uniqueFileName);

  await sharp(file.buffer)
    .resize({ width: 463 })
    .toFormat("webp")
    .toFile(imagePath);

  return uniqueFileName;
};

module.exports = { processImage };
