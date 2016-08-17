var xpush = require('xpush');
var Parse = require('parse/node');
var utils = require('./utils');

var Messages = Parse.Object.extend("Messages");
var Channels = Parse.Object.extend("Channels");

var ChannelServer = exports.ChannelServer = function (options, cb) {

  if (!options || !options.port) {
    throw new Error('Both `options` and `options.port` are required.');
  }

  Parse.initialize(options.app || 'STALK');
  Parse.serverURL = options.serverURL || 'http://localhost:8080/parse';

  this.server = xpush.createChannelServer(options);
  this.redisClient = this.server.sessionManager.redisClient;

  this.server.onSend(function(params){
  	if( params.DT ){
  		params.DT.msgid = utils.getMsgid();
  	}
  });

  this.server.onConnection(function( socket ){

    /*
  	socket.emit('name', '[data]' );
  	socket.on('ping', function(data){
      socket.emit('message', 'pong' );
  	});
    */

  });

  this.server.onSend(function (data, socket){

    var channel = new Channels();
    channel.id = socket.handshake.query.C; // channel Id

    var user = new Parse.User();
    user.id = socket.handshake.query.U; // user Id

    var message = new Messages();
    message.set("channel",  channel       );
    message.set("user",     user          );
    message.set("message",  data.DT.text  );
    message.save().then(
      (result) => {

        console.warn(result);
        socket.emit('sent', {
          tempId: data.DT._id,
          id: result.id
        });

      },
      (error) => {

        console.warn(error);
        socket.emit('sent', {
          tempId: data.DT._id,
          error: error
        });

      }
    );

  });

  this.server.on('started', function (url, port){
  	console.log( "Channel Server STARTED : ", url, port );
  });

};