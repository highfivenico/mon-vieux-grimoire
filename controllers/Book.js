const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");
const { processImage } = require("../utils/imageProcessor");

exports.createBook = async (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const uniqueFileName = await processImage(req.file);

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

exports.updateBook = async (req, res, next) => {
  const bookObject = req.file
    ? { ...JSON.parse(req.body.book) }
    : { ...req.body };

  delete bookObject._userId;

  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }
    if (book.userId != req.auth.userId) {
      return res.status(401).json({ message: "Non-autorisé" });
    }

    if (req.file) {
      const uniqueFileName = await processImage(req.file);

      const oldFilename = book.imageUrl.split("/images/")[1];
      const oldImagePath = path.join("images", oldFilename);

      try {
        await fsPromises.unlink(oldImagePath);
      } catch (error) {
        console.warn("Suppression de l'ancienne image échouée :", error);
      }

      bookObject.imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/images/${uniqueFileName}`;
    }

    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    );
    res.status(200).json({ message: "Livre modifié avec succès." });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé." });
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
