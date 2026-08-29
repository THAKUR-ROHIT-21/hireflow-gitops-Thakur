const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Interviewer = sequelize.define("Interviewer", {
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
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "company_id"
  },
  title: DataTypes.STRING(100)
}, {
  tableName: "interviewers",
  underscored: true
});

module.exports = Interviewer;
