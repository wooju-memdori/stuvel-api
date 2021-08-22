const Sequelize = require('sequelize');
const User = require('./User');
const Token = require('./Token');
const Room = require('./Room');
const Follow = require('./Follow');
const Tag = require('./Tag');
const UserTag = require('./UserTag');

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
db.Tag = Tag;
db.Follow = Follow;
db.UserTag = UserTag;

Follow.init(sequelize);
User.init(sequelize);
Token.init(sequelize);
Room.init(sequelize);
Tag.init(sequelize);
UserTag.init(sequelize);

Follow.associate(db);
User.associate(db);
Token.associate(db);
Room.associate(db);
Tag.associate(db);
UserTag.associate(db);

module.exports = db;
