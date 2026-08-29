const express = require("express");
const {
  hrDashboard,
  candidateDashboard
} = require("../controllers/dashboardController");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/hr",
  authenticate,
  requireRole("hr"),
  hrDashboard
);

router.get(
  "/candidate",
  authenticate,
  requireRole("candidate"),
  candidateDashboard
);

module.exports = router;
