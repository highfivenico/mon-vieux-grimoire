const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const bookCtrl = require("../controllers/book");

router.post("/", auth, bookCtrl.createBook);
// router.post("/:id/rating", auth, bookCtrl.rateBook);
router.put("/:id", auth, bookCtrl.updateBook);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.getAllBooks);
// router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
