const express = require("express");
const {
  getAllGadgets,
  addGadget,
  updateGadget,
  decommissionGadget,
  selfDestructGadget
} = require("../controllers/gadgetController.js");
const { authenticate } = require("../middlewares/auth.js");

const router = express.Router();

router.get("/", authenticate, getAllGadgets);
router.post("/", authenticate, addGadget);
router.patch("/:id", authenticate, updateGadget);
router.delete("/:id", authenticate, decommissionGadget);
router.post("/:id/self-destruct", authenticate, selfDestructGadget);

module.exports = router;