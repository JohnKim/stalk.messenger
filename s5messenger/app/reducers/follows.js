/**
 * Follows Reducer
 */

import { LOADED_FOLLOWS, ADDED_FOLLOWS, REMOVED_FOLLOWS, LOGGED_OUT } from 's5-action';

const initialState = {
  list: [],
  lastLoadedAt: null,
};

function follows(state = initialState, action) {

  if (action.type === LOADED_FOLLOWS) {
      let list = action.list.map(fromParseObject);
      return {
        list,
        lastLoadedAt: new Date(),
      };
  }

  if (action.type === REMOVED_FOLLOWS) {
      console.log(action);
      let newData = [...state.list];
      console.log(newData);
      newData.splice(action.row, 1);
      return {
        list: newData,
        lastLoadedAt: new Date(),
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
    followId: object.id,
    id: user.id,
    username: user.get('username'),
    email: user.get('email'),
    nickName: user.get('nickName'),
    profileImage: user.get('profileImage')
  };
}

module.exports = follows;
