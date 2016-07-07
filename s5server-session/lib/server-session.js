var xpush       = require('xpush');
var path        = require('path');
var express     = require('express');
var ParseServer = require('parse-server').ParseServer;
var bodyParser  = require('body-parser');


/**
 *
 * options : host, port, logo, home, zookeeper, redis, mongodb, app
 */
var SessionServer = exports.SessionServer = function (options, cb) {

  if (!options || !options.port) {
    throw new Error('Both `options` and `options.port` are required.');
  }

  var api = new ParseServer({
    databaseURI: options.mongodb || 'mongodb://localhost:27017/stalk-messenger',
    cloud: __dirname + '/cloud/main.js',
    appId: options.app || 'STALK',
    masterKey: options.master || 's3cR3T', //Add your master key here. Keep it secret!
    serverURL: options.host+':'+options.port+'/parse'
  });

  var staticPath = path.normalize(__dirname + '/../public');

  //===============EXPRESS=================

  var app = express();
  app.use( bodyParser.urlencoded({ extended: false }) ); 	// parse application/x-www-form-urlencoded
  app.use( bodyParser.json() );							              // parse application/json
  app.use('/public', express.static(staticPath));

  app.use('/parse', api);

  app.get('/test', function(req, res) {
    res.sendFile(path.join(staticPath, '/test.html'));
  });

  app.get('/', function(req, res) {
    res.status(200).send('PONG !! ');
  });

  //=============== Start XPUSH Session Server =================

  var self = this;
  this.server = xpush.createSessionServer(options, cb, app);

  this.server.on('started', function (url, port) {

    ParseServer.createLiveQueryServer(self.server);

    console.log(url, port);
  });

};
