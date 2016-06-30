var ChannelServer = exports.ChannelServer = require('./server-channel').ChannelServer;

/**
 * Create channel server
 * @name createChannelServer
 * @function createChannelServer
 */
exports.createChannelServer = function (options, cb) {
  var server;
  server = new ChannelServer(options, cb);
  return server;
};
