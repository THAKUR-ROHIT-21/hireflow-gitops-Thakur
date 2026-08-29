const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Interview = sequelize.define("Interview", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "application_id"
  },
  roundId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "round_id"
  },
  interviewerId: {
    type: DataTypes.UUID,
    field: "interviewer_id"
  },
  scheduledBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "scheduled_by"
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  interviewType: {
    type: DataTypes.ENUM("screening", "technical", "behavioral", "final", "hr"),
    allowNull: false,
    field: "interview_type"
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "scheduled_at"
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
    field: "duration_minutes"
  },
  meetingUrl: {
    type: DataTypes.TEXT,
    field: "meeting_url"
  },
  status: {
    type: DataTypes.ENUM("scheduled", "rescheduled", "cancelled", "completed", "no_show"),
    allowNull: false,
    defaultValue: "scheduled"
  },
  candidateNotes: {
    type: DataTypes.TEXT,
    field: "candidate_notes"
  }
}, {
  tableName: "interviews",
  underscored: true
});

module.exports = Interview;
