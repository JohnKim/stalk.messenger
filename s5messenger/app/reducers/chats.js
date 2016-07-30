/**
 * Chat datas for Chats Tab
 */
import { LOADED_CHATS, ADDED_CHATS, REMOVED_CHATS, LOGGED_OUT } from 's5-action';

const initialState = {
  list: [],
  lastLoadedAt: null,
};

let currentUser = null; // to emit current user data into chat users of the channel.

function follows(state = initialState, action) {

  if (action.type === LOADED_CHATS) {
      currentUser = action.user; // to emit current user data into chat users of the channel.
      let list = action.list.map(chatsParseObject);

      return {
        list,
        lastLoadedAt: new Date(),
      };

  } else if (action.type === ADDED_CHATS) {

    currentUser = action.user;

    let chat = chatsParseObject(action.chat);
    let newData = [...state.list];
    newData.unshift(chat);

    return {
      list: newData,
      lastLoadedAt: new Date(),
    };

  } else if (action.type === LOGGED_OUT) {
    return initialState;
  }

  return state;
}

function chatsParseObject(object){

  var channel = object.get("channel");
  var users = channel.get("users");
  var names = [];
  users.reduceRight(function(acc, user, index, object) {

    //console.log(user.id === currentUser.id, user.id, currentUser.id);

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

module.exports = follows;
