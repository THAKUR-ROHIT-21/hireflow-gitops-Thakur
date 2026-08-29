const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  role: {
    type: DataTypes.ENUM("hr", "candidate"),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("active", "inactive", "suspended"),
    allowNull: false,
    defaultValue: "active"
  },
  fullName: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: "full_name"
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: "password_hash"
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: "company_id"
  }
}, {
  tableName: "users",
  underscored: true
});

module.exports = User;
