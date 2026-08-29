const { Sequelize } = require("sequelize");

const options = {
  dialect: "postgres",
  logging: false
};

if (process.env.DB_SSL === "true") {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  options
);

module.exports = { sequelize };
