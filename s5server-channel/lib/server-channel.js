var xpush = require('xpush');
var utils = require('./utils');


var ChannelServer = exports.ChannelServer = function (options, cb) {

  if (!options || !options.port) {
    throw new Error('Both `options` and `options.port` are required.');
  }

  this.server = xpush.createChannelServer(options);
  this.redisClient = this.server.sessionManager.redisClient;

  this.server.onSend(function(params){
  	if( params.DT ){
  		params.DT.msgid = utils.getMsgid();
  	}
  });

  this.server.onConnection(function( socket ){

  	socket.emit('connection', 'dumy' );

  	socket.on('ping', function(data){
      socket.emit('message', 'pong' );
  	});

  });

  // 교환되는 모든 메시지 전문을 컨트롤하기 위한 Event 함수.
  this.server.onSend(function (message){
    console.log(message);
  });

  this.server.on('started', function (url, port){
  	console.log( "Channel Server STARTED : ", url, port );
  });

};
