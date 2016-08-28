
var Chats = Parse.Object.extend("Chats");
var Channels = Parse.Object.extend("Channels");


Parse.Cloud.define('chats', function(request, response) {
  Parse.Cloud.useMasterKey();

  var user = request.user;
  if (!user) {
    return response.success([]);
  }

  new Parse.Query(Chats)
    .equalTo('user', currentUser)
    .include('channel.users')
    .find()
    .then(
      (value) => { response.success(value); },
      (error) => { response.error(error); }
    );
});

Parse.Cloud.define('chats-create', function(request, response) {
  Parse.Cloud.useMasterKey();

  var currentUser = request.user;
  if (!currentUser) {
    return response.error({message: 'Not logged in'});
  }

  var params = request.params;
  if (!params.id && !params.ids ) {
    return response.error({message: 'Need username for following.'});
  }

  if( params.id == currentUser.id) {
    // ParseError.VALIDATION_ERROR = 142; (Error code indicating that a Cloud Code validation failed.)
    response.error( {code: 142, message: "input param ("+params.id+") is same with current user"} );
    return;
  }

  var userArray = [currentUser];
  if( params.id ) {
    var user = new Parse.User();
    user.id = params.id;
    userArray.push( user );
  } else if ( params.ids ){
    for( var key in params.ids ){
      var user = new Parse.User();
      user.id = params.ids[key];
      userArray.push( user );
    }
  }

  var query = new Parse.Query(Channels);
  query.containsAll("users", userArray);
  var ids = request.params.ids;

  if (Array.isArray(ids) && ids.length == 0) {
    return response.error({message: '[ids] must to be existed.'});
  }

  var users = [currentUser];

  if (Array.isArray(ids)) {
    ids.forEach(function(userId) {

      if(userId == currentUser.id) {
        // ParseError.VALIDATION_ERROR = 142; (Error code indicating that a Cloud Code validation failed.)
        response.error( {code: 142, message: "input param ("+userId+") is same with current user"} );
        return;
      }

      var user = new Parse.User();
      user.id = userId;
      users.push(user);

    });
  } else {
    var user = new Parse.User();
    user.id = userId;
    users.push(user);
  }

  var query = new Parse.Query(Channels);
  query.containsAll("users", users);
  query.first().then(

    (channel) => {

      if(!channel) {
        var channels = new Channels();
        for( var key in userArray ){
          channels.addUnique("users", userArray[key]);
        }

        users.forEach(function(user) {
          channels.addUnique("users", user);
        });
        return channels.save();
      }else{
        return Parse.Promise.as(channel);
      }

    },
    (error) => {

      response.error(error);

    }

  ).then(

    (channel) => {

      var queryChats = new Parse.Query(Chats);
      queryChats.equalTo("user", currentUser);
      queryChats.equalTo("channel", channel);
      queryChats.first().then(

        (chat) => {
          if(!chat){
            var chats = new Chats();
            chats.set("user", currentUser);
            chats.set("channel", channel);
            chats.save().then(
              (value) => { response.success(value); },
              (error) => { response.error(error); }
            );
          }else{
            response.success(chat);
          }
        },
        (error) => {
          response.error(error);
        }
      );

    },
    (error) => {

      response.error(error);

    }

  );

});

Parse.Cloud.define('chats-add', function(request, response) {

  var ids = request.params;
  var channelId = request.params;

  var users = [currentUser];

  if (Array.isArray(ids)) {
    ids.forEach(function(userId) {

      if(userId == currentUser.id) {
        // ParseError.VALIDATION_ERROR = 142; (Error code indicating that a Cloud Code validation failed.)
        response.error( {code: 142, message: "input param ("+userId+") is same with current user"} );
        return;
      }

      var user = new Parse.User();
      user.id = userId;
      users.push(user);

    });
  } else {
    var user = new Parse.User();
    user.id = ids;
    users.push(user);
  }

  var channel = new Channels();
  channel.id = channelId;

  var fnCreateChat = function ( channel, user ) {
    return new Promise((resolve, reject) => {
      var chats = new Chats();
      chats.set("user", user);
      chats.set("channel", channel);
      chats.save().then(
        (value) => { resolve(value); },
        (error) => { reject(error); }
      );
    });
  };

  var fnArray = [];
  users.forEach(function(user) {
    fnArray.push(fnCreateChat(channel, user));
  });

  Promise.all(fnArray).then(value => {
    response.success(value);
  }, reason => {
    response.error(error);
  });

});

Parse.Cloud.define('chats-remove', function(request, response) {

  var currentUser = request.user;
  if (!currentUser) {
    return response.error({message: 'Not logged in'});
  }

  var params = request.params;
  if (!params.id) {
    return response.error({message: 'Need chat id for following.'});
  }

  new Parse.Query(Chats).get( params.id, {
      success: (result) => {

        if(result) {
          result.destroy().then(
            (object)  => { response.success(object);  },
            (error)   => { response.error(error);     }
          );
        } else {
          // ParseError.OBJECT_NOT_FOUND = 101 (Error code indicating the specified object doesn't exist.)
          response.error( {code: 101, message: "object doesn't exist."} );
        }

      },
      error: function(error) {
        console.log(error);
        response.error(error);
      }
    });

});
