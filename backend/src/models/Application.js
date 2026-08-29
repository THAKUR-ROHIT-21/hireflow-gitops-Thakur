const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Application = sequelize.define("Application", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  candidateId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "candidate_id"
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "job_id"
  },
  currentRoundId: {
    type: DataTypes.UUID,
    field: "current_round_id"
  },
  status: {
    type: DataTypes.ENUM(
      "applied",
      "screening",
      "technical",
      "final",
      "offer",
      "hired",
      "rejected",
      "withdrawn"
    ),
    allowNull: false,
    defaultValue: "applied"
  },
  appliedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "applied_at"
  }
}, {
  tableName: "applications",
  underscored: true,
  indexes: [{ unique: true, fields: ["candidate_id", "job_id"] }]
});

module.exports = Application;
