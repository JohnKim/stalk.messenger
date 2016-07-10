/**
 * @providesModule s5-action
 */

const commonActions = require('./common');
const userActions = require('./user');
const followsActions = require('./follows');

module.exports = {
  ...commonActions,
  ...userActions,
  ...followsActions,
};
