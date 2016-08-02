const chats     = require('./chats');
const follows   = require('./follows');

module.exports = {
  ...chats,
  ...follows,
};
