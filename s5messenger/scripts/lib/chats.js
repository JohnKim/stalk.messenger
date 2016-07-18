import Parse  from 'parse/node';
import faker  from 'faker';
import Common from './_common';
import response from './_response';

var Chats     = Parse.Object.extend("Chats");
var Channels  = Parse.Object.extend("Channels");

exports.create = async function (username, targetUsername) {

  var currentUser = new Parse.User();
  currentUser.id = await Common.getUserId(username);

  var user = new Parse.User();
  user.id = await Common.getUserId(targetUsername);

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

}
