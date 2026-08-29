const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CandidateProfile = sequelize.define("CandidateProfile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: "user_id"
  },
  desiredRole: {
    type: DataTypes.STRING(150),
    field: "desired_role"
  },
  phone: DataTypes.STRING(30),
  location: DataTypes.STRING(150),
  resumeUrl: {
    type: DataTypes.TEXT,
    field: "resume_url"
  },
  linkedinUrl: {
    type: DataTypes.TEXT,
    field: "linkedin_url"
  },
  githubUrl: {
    type: DataTypes.TEXT,
    field: "github_url"
  },
  bio: DataTypes.TEXT
}, {
  tableName: "candidate_profiles",
  underscored: true
});

module.exports = CandidateProfile;
