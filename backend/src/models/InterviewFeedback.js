const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const InterviewFeedback = sequelize.define("InterviewFeedback", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  interviewId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: "interview_id"
  },
  interviewerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "interviewer_id"
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  recommendation: {
    type: DataTypes.ENUM("strong_yes", "yes", "neutral", "no", "strong_no"),
    allowNull: false
  },
  strengths: DataTypes.TEXT,
  weaknesses: DataTypes.TEXT,
  comments: DataTypes.TEXT,
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "submitted_at"
  }
}, {
  tableName: "interview_feedback",
  underscored: true
});

module.exports = InterviewFeedback;
