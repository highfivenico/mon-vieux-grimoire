const express = require("express");
const auth = require("../middleware/auth");
const bookCtrl = require("../controllers/book");
const multer = require("../middleware/multer-config");
const router = express.Router();

router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, multer, bookCtrl.createBook);
router.put("/:id", auth, multer, bookCtrl.updateBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
