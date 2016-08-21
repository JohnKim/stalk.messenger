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
      let list = action.list.map(_parseObjToJSON);
      return {
        list,
        lastLoadedAt: new Date(),
      };

  } else if (action.type === REMOVED_FOLLOWS) {
      let newData = [...state.list];
      newData.splice(action.row, 1);
      return {
        list: newData,
        lastLoadedAt: new Date(),
      };

  } else if (action.type === ADDED_FOLLOWS) {

    let follow = _parseObjToJSON(action.follow);
    console.log(follow);
    let newData = [...state.list];
    newData.unshift(follow);

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
  var user = object.get('userTo');
  var profileImage = "";
  if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
    profileImage = user.get('profileFile').url();
  }

  return {
    followId: object.id,
    id: user.id,
    username: user.get('username'),
    email: user.get('email'),
    nickName: user.get('nickName'),
    statusMessage: user.get('statusMessage'),
    profileImage: profileImage,
  };
}

module.exports = follows;
