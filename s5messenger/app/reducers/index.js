/**
 *
 */

var { combineReducers } = require('redux');

module.exports = combineReducers({
  config: require('./config'),
  navigation: require('./navigation'),
  user: require('./user'),
});
