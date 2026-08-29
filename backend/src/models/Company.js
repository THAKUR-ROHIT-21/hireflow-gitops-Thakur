const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Company = sequelize.define("Company", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: DataTypes.STRING(255),
  website: DataTypes.STRING(255),
  industry: DataTypes.STRING(100),
  description: DataTypes.TEXT
}, {
  tableName: "companies",
  underscored: true
});

module.exports = Company;
