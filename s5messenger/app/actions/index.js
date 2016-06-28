/**
 * @providesModule s5-action
 */

const commonActions = require('./common');
const loginActions = require('./login');

module.exports = {
  ...commonActions,
  ...loginActions,
};
