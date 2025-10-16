const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/Book");

router.post("/", bookCtrl.createBook);
router.put("/:id", bookCtrl.updateBook);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.getAllBooks);
router.delete("/:id", bookCtrl.deleteBook);

module.exports = router;
