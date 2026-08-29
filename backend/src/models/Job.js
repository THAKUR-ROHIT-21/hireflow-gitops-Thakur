const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "company_id"
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "created_by"
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  department: DataTypes.STRING(100),
  location: DataTypes.STRING(150),
  employmentType: {
    type: DataTypes.STRING(50),
    field: "employment_type"
  },
  description: DataTypes.TEXT,
  requirements: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM("draft", "open", "closed", "archived"),
    allowNull: false,
    defaultValue: "draft"
  },
  openedAt: {
    type: DataTypes.DATE,
    field: "opened_at"
  },
  closedAt: {
    type: DataTypes.DATE,
    field: "closed_at"
  }
}, {
  tableName: "jobs",
  underscored: true
});

module.exports = Job;
