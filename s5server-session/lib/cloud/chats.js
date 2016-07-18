
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
  if (!params.id) {
    return response.error({message: 'Need username for following.'});
  }

  var user = new Parse.User();
  user.id = params.id;

  var query = new Parse.Query(Channels);
  query.containsAll("users", [currentUser, user]);
  query.first().then(

    (channel) => {
      if(!channel) {
        var channels = new Channels();
        channels.addUnique("users", currentUser);
        channels.addUnique("users", user);
        return channels.save();
      }else{
        return Parse.Promise.as(channel);
      }
    },
    (error) => {
      response.error({message: 'Need username for following.'});
    }

  ).then(function(channel) {

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
          response.success(value); // TODO 에러 처리
        }
      },
      (error) => {
        response.error({message: 'Need username for following.'});
      }
    );

  });

});

Parse.Cloud.define('chats-remove', function(request, response) {

  // TODO logic here
  // remove chats and channel data (input request.params.id : channel.id)
  response.success("TODO");

});
