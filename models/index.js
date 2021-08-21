const Sequelize = require('sequelize');
const User = require('./User');
const Token = require('./Token');
const Room = require('./Room');

const db = {};

const config = {
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);
db.sequelize = sequelize;

db.User = User;
db.Token = Token;
db.Room = Room;

User.init(sequelize);
Token.init(sequelize);
Room.init(sequelize);

User.associate(db);
Token.associate(db);
Room.associate(db);

module.exports = db;
