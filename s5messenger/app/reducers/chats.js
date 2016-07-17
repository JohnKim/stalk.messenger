/**
 * Follows Reducer
 */

import { LOADED_CHATS, ADDED_CHATS, REMOVED_CHATS, LOGGED_OUT } from 's5-action';

const initialState = {
  list: [],
  lastLoadedAt: null,
};

function follows(state = initialState, action) {

  if (action.type === LOADED_CHATS) {
      let list = action.list.map(chatsParseObject);
      return {
        list,
        lastLoadedAt: new Date(),
      };
  }

  if (action.type === LOGGED_OUT) {
    return initialState;
  }

  return state;
}

function chatsParseObject(object){

  var channel = object.get("channel");
  var users = channel.get("users");

  users.reduceRight(function(acc, item, index, object) {
    if (item.get("username") === 'test1') {
      object.splice(index, 1);
    } else {
      object[index] = {
        id: item.id,
        username: item.get('username'),
        email: item.get('email'),
        nickName: item.get('nickName'),
        profileImage: item.get('profileImage')
      }
    }
  }, []);


  return {
    id: object.id,
    users,
  };
};

module.exports = follows;
