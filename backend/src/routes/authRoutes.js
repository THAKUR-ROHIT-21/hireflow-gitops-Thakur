const express = require("express");
const {
  registerHR,
  registerCandidate,
  login
} = require("../controllers/authController");

const router = express.Router();

router.post("/register/hr", registerHR);
router.post("/register/candidate", registerCandidate);
router.post("/login", login);

module.exports = router;
