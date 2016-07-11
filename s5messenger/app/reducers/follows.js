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
  return {
    id: object.id,
    username: object.get('username'),
    nickname: object.get('nickname'),
    email: object.get('nickname'),
  };
}

module.exports = follows;
