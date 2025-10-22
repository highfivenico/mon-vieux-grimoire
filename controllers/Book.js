const Book = require("../models/Book");
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const { processImage } = require("../utils/imageProcessor");

// Création d'un livre
exports.createBook = async (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    // Validation d'un champ numérique pour 'year'
    if (!Number.isInteger(bookObject.year) || bookObject.year < 0) {
      return res.status(400).json({ error: "Année invalide." });
    }

    // Validation des champs obligatoires
    if (
      !bookObject.title ||
      !bookObject.author ||
      !bookObject.genre ||
      !req.file
    ) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    // Traitement de l'image et obtention du nom de fichier unique
    const uniqueFileName = await processImage(req.file);

    // Création d'un nouvel objet Book avec l'URL de l'image
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${uniqueFileName}`,
    });
    await book.save();
    res.status(201).json({ message: "Livre ajouté avec succès." });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Modification d'un livre
exports.updateBook = async (req, res, next) => {
  const bookObject = req.file
    ? { ...JSON.parse(req.body.book) }
    : { ...req.body };

  delete bookObject._userId;

  // Validation d'un champ numérique pour 'year'
  if (
    bookObject.year &&
    (!Number.isInteger(bookObject.year) || bookObject.year < 0)
  ) {
    return res.status(400).json({ error: "Année invalide." });
  }

  try {
    // Vérification des droits de l'utilisateur
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non-autorisé" });
    }

    // Si une nouvelle image est fournie, traiter l'image et supprimer l'ancienne
    if (req.file) {
      const uniqueFileName = await processImage(req.file);
      // Mettre à jour l'URL de l'image dans l'objet bookObject
      bookObject.imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/images/${uniqueFileName}`;
    }
    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    );
    if (req.file) {
      const oldFilename = book.imageUrl.split("/images/")[1];
      const oldImagePath = path.join("images", oldFilename);

      try {
        await fsPromises.unlink(oldImagePath);
      } catch (error) {
        console.warn("Suppression de l'ancienne image échouée :", error);
      }
    }

    // Mise à jour du livre dans la base de données
    res.status(200).json({ message: "Livre modifié avec succès." });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Récupération d'un seul livre
exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Suppression d'un livre
exports.deleteBook = async (req, res, next) => {
  try {
    // Vérification des droits de l'utilisateur
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non-autorisé" });
    }

    // Supprime le livre de la base de données
    await Book.deleteOne({ _id: req.params.id });

    // Supprime l'image
    const filename = book.imageUrl.split("/images/")[1];
    const imagePath = path.join("images", filename);
    try {
      await fsPromises.unlink(imagePath);
    } catch (error) {
      console.warn(error);
    }
    res.status(200).json({ message: "Livre supprimé." });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Noter un livre
exports.rateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.auth.userId;
    const grade = Number(req.body.rating);

    // Validation de la note
    if (!Number.isFinite(grade) || grade < 0 || grade > 5) {
      return res
        .status(400)
        .json({ message: "La note doit être comprise entre 0 et 5." });
    }

    // Récupération du livre
    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    // Vérification si l'utilisateur a déjà noté le livre
    const alreadyRated = book.ratings.find((r) => r.userId === userId);
    if (alreadyRated) {
      return res
        .status(403)
        .json({ message: "Vous avez déjà attribué une note à ce livre." });
    }

    // Ajout de la nouvelle note
    book.ratings.push({ userId, grade });

    // Calcul de la nouvelle moyenne des notes
    const totalGrades = book.ratings.reduce((acc, r) => acc + r.grade, 0);
    book.averageRating = parseFloat(
      (totalGrades / book.ratings.length).toFixed(1)
    );

    // Sauvegarde des modifications
    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Récupérer les 3 livres les mieux notés
exports.getBestRatedBooks = async (req, res, next) => {
  try {
    const bestRatedBooks = await Book.find()
      .sort({ averageRating: -1 })
      .limit(3);
    res.status(200).json(bestRatedBooks);
  } catch (error) {
    res.status(500).json({ error });
  }
};
