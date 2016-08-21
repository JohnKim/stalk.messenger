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
      let list = action.list.map(_parseObjToJSON);

      return {
        list,
        lastLoadedAt: new Date(),
      };

  } else if (action.type === ADDED_CHATS) {

    currentUser = action.user;

    let chat = _parseObjToJSON(action.chat);
    let newData = [...state.list];
    newData.unshift(chat);

    return {
      list: newData,
      lastLoadedAt: new Date(),
    };

  } else if (action.type === REMOVED_CHATS) {

      let newData = [...state.list];
      newData.splice(action.row, 1);

      return {
        list: newData,
        lastLoadedAt: new Date(),
      };

  } else if (action.type === LOGGED_OUT) {
    return initialState;
  }

  return state;
}


export function _parseObjToJSON(object){

  var channel = object.get("channel");
  var users = channel.get("users");
  var names = [];

  users.reduceRight(function(acc, user, index, object) {

    if (user.id === currentUser.id) {
      object.splice(index, 1);
    } else {

      var profileImage = "";
      if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
        profileImage = user.get('profileFile').url();
      }

      object[index] = {
        id: user.id,
        username: user.get('username'),
        email: user.get('email'),
        nickName: user.get('nickName'),
        profileImage: profileImage
      }
      names.push(user.get('username'));
    }
  }, []);

  return {
    id: object.id,
    channelId: channel.id,
    createdAt: object.get("createdAt"), // because of using javascript date objects instead of parse object 'object.createdAt',
    name: names.join(", "),
    users,
  };

}

module.exports = follows;
