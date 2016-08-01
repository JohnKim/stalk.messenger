import Parse from 'parse/react-native';

export function chat2Json(object){

  var channel = object.get("channel");
  var users = channel.get("users");
  var names = [];

  var currentUser = Parse.User.current();

  users.reduceRight(function(acc, user, index, object) {

    if (user.id === currentUser.id) {
      object.splice(index, 1);
    } else {
      object[index] = {
        id: user.id,
        username: user.get('username'),
        email: user.get('email'),
        nickName: user.get('nickName'),
        profileImage: user.get('profileImage')
      }
      names.push(user.get('username'));
    }
  }, []);

  return {
    id: object.id,
    channelId: channel.id,
    name: names.join(", "),
    users,
  };

};
