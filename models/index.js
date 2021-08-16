const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];
const User = require('./User');
const Token = require('./Token');

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);
db.sequelize = sequelize;

db.User = User;
db.Token = Token;

User.init(sequelize);
Token.init(sequelize);

User.associate(db);
Token.associate(db);

module.exports = db;
