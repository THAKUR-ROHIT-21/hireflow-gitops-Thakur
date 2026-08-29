require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/database");

require("./models");

const apiRoutes = require("./routes");

const app = express();

// ============================================================
// CORS
// ============================================================

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN
          .split(",")
          .map((value) => value.trim())
      : true,
  })
);

// ============================================================
// BODY PARSER
// ============================================================

app.use(express.json({ limit: "1mb" }));

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// ============================================================
// API ROUTES
// ============================================================

app.use("/api", apiRoutes);

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal server error",
  });
});

// ============================================================
// SERVER
// ============================================================

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Check PostgreSQL connection
    await sequelize.authenticate();

    console.log("PostgreSQL connected");

    // Create tables from Sequelize models
    await sequelize.sync();

    console.log("Database tables synchronized");

    // Start API server
    app.listen(PORT, () => {
      console.log(`HireFlow API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database startup failed:", error);

    process.exit(1);
  }
}

startServer();