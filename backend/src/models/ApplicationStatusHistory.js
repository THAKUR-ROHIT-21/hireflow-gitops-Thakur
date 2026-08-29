const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ApplicationStatusHistory = sequelize.define("ApplicationStatusHistory", {
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
  oldStatus: {
    type: DataTypes.STRING(30),
    field: "old_status"
  },
  newStatus: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "new_status"
  },
  changedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "changed_by"
  },
  notes: DataTypes.TEXT
}, {
  tableName: "application_status_history",
  underscored: true
});

module.exports = ApplicationStatusHistory;
