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

  	// 연결
  	socket.emit('connection', 'dumy' );
  	socket.emit('connected', 'Welcome to the chat server');

  	socket.on('setJoinRoom', function(data){

      var message = {result: 'true', 'roomid': data.roomid};
      socket.join(data.roomid);

      console.log('* setJoinRoom * ' + socket.id + ' ' + message);

      socket.emit('setJoinRoom', message);

  	});

  	socket.on('setLeftRoom', function(data){
      console.log('* setLeftRoom * ' + socket.id + ' ' + data.roomid);

      socket.leave(data.roomid);            // 아웃처리
      socket.emit('setLeftRoom', message);  // 아웃 메세지
  	});

  	//상담원 변경요청 status 증감 요청
  	socket.on('setMessage', function(data){
      message = { 'roomid': data.roomid, msg: data.msg } ;
  		message.msgid = utils.getMsgid();           // 메세지 아이디 재설정

  		socket.broadcast.to(data.roomid).emit('setMessage', message);		// 메세지 브로드캐스트

  		var monologue = message;
  		monologue.result = 'true';                  // 메세지 설정, 내가 보낸 메세지 result 설정

      console.log('* setMessage * ' + socket.id);
  		socket.emit('setMessage', monologue);				// 메세지 emit
  	});

  	// Clean up on disconnect
  	socket.on('disconnect', function() {

  		console.log('* disconnect * ' + socket.id);
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
