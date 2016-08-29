/**
 * Chat datas for Chats Tab
 */
import { LOADED_CHATS, ADDED_TEMP_CHAT, ADDED_CHAT, REMOVED_CHATS, LOGGED_OUT } from 's5-action';

const initialState = {
  list: [],
  lastLoadedAt: null,
  ids: '',
};

let currentUser = null; // to emit current user data into chat users of the channel.

function chats(state = initialState, action) {

  if (action.type === LOADED_CHATS) {
      currentUser = action.user; // to emit current user data into chat users of the channel.
      let list = action.list.map(_parseObjToJSON);

      return {
        list,
        lastLoadedAt: new Date(),
      };

  } else if (action.type === ADDED_TEMP_CHAT) {

    currentUser = action.user;

    let chat = _generateTempChatJSON(action.id, action.users);
    let newData = [...state.list];
    newData.unshift(chat);

    return {
      list: newData,
      lastLoadedAt: new Date(),
    };

  } else if (action.type === ADDED_CHAT) {

    currentUser = action.user;

    let chat = _parseObjToJSON(action.chat);
    let newData = [...state.list];

    if(action.beforeId) {
      for(var i = newData.length-1; i--;){
        if ( newData[i].id === action.beforeId ) {
          newData.splice(i, 1);
          break;
        }
      }
    }

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

function _parseObjToJSON(object){

  var channel = object.get("channel");
  var users = channel.get("users");
  var names = [];

  users.reduceRight(function(acc, user, index, object) {

    if (user.id === currentUser.id) {
      object.splice(index, 1);
    } else {

      var profileFileUrl = "";
      if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
        profileFileUrl = user.get('profileFile').url();
      }

      object[index] = {
        id: user.id,
        username: user.get('username'),
        email: user.get('email'),
        nickName: user.get('nickName'),
        statusMessage: user.get('statusMessage'),
        profileFileUrl: profileFileUrl,
      }
      names.push(user.get('nickName'));
    }
  }, []);

  return {
    id: object.id,
    channelId: channel.id,
    updatedAt: object.get("updatedAt"), // because of using javascript date objects instead of parse object 'object.createdAt',
    name: names.join(", "),
    type: 'STORED',
    users,
  };

}

function _generateTempChatJSON(id, users) {

  var names = [];
  users.forEach(function (user) {
    names.push(user.nickName);
  });

  return {
    id,
    channelId: id,
    updatedAt: new Date(),
    name: names.join(", "),
    type: 'TEMP',
    users,
  };
}

module.exports = chats;
