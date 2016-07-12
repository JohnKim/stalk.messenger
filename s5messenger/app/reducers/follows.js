/**
 * Follows Reducer
 */

import { LOADED_FOLLOWS, ADDED_FOLLOWS, REMOVED_FOLLOWS, LOGGED_OUT } from 's5-action';

const initialState = {
  list: [],
  loadedAt: null,
};

function follows(state = initialState, action) {

  if (action.type === LOADED_FOLLOWS) {
      let list = action.list.map(fromParseObject);
      return {
        list,
        loadedAt: new Date(),
      };
  }

  if (action.type === LOGGED_OUT) {
    return initialState;
  }

  return state;
}

function fromParseObject(object){
  var user = object.get('userTo');
  return {
    id: object.id,
    username: user.get('username'),
    email: user.get('email'),
    nickName: user.get('nickName'),
    profileImage: user.get('profileImage')
  };
}

module.exports = follows;
