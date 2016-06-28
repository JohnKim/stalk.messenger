var SessionServer = exports.SessionServer = require('./server-session').SessionServer;

/**
 * Create session server
 * @name createSessionServer
 * @function createSessionServer
 */
exports.createSessionServer = function (options, cb) {
  var server;
  server = new SessionServer(options, cb);
  return server;
};
