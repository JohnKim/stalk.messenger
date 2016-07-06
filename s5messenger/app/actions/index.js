/**
 * @providesModule s5-action
 */

const commonActions = require('./common');
const userActions = require('./user');

module.exports = {
  ...commonActions,
  ...userActions,
};
