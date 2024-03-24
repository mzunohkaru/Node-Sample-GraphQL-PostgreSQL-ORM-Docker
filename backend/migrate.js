const { sequelize } = require("./db");

const User = require("./models/user");
const Post = require("./models/post");

const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ force: true }); // 注意: これはデータベースをリセットします
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migrate();
