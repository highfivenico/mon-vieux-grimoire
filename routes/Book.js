const express = require("express");
const auth = require("../middleware/auth");
const bookCtrl = require("../controllers/book");
const multer = require("../middleware/multer-config");
const router = express.Router();

router.post("/", auth, multer, bookCtrl.createBook);
// router.post("/:id/rating", auth, bookCtrl.rateBook);
router.put("/:id", auth, multer, bookCtrl.updateBook);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.getAllBooks);
// router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
