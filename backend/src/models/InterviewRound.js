const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const InterviewRound = sequelize.define("InterviewRound", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "job_id"
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  roundOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "round_order"
  },
  interviewType: {
    type: DataTypes.ENUM("screening", "technical", "behavioral", "final", "hr"),
    allowNull: false,
    field: "interview_type"
  },
  description: DataTypes.TEXT
}, {
  tableName: "interview_rounds",
  underscored: true,
  indexes: [{ unique: true, fields: ["job_id", "round_order"] }]
});

module.exports = InterviewRound;
