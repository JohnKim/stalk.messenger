/**
 * Follows Reducer
 */

import { LOADED_FOLLOWS, ADDED_FOLLOWS, REMOVED_FOLLOWS, LOGGED_OUT } from 's5-action';

const initialState = {
  list: [],
  lastLoadedAt: null,
};

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function follows(state = initialState, action) {

  if (action.type === LOADED_FOLLOWS) {
      let list = action.list.map(_parseObjToJSON);
      return {
        list: sortByKey(list, 'nickName'),
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
    let newData = [...state.list];
    newData.unshift(follow);

    return {
      list: sortByKey(newData, 'nickName'),
      lastLoadedAt: new Date(),
    };

  } else if (action.type === LOGGED_OUT) {

    return initialState;

  }

  return state;
}

export function _parseObjToJSON(object){
  var user = object.get('userTo');
  var profileFileUrl = "";
  if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
    profileFileUrl = user.get('profileFile').url();
  }

  return {
    followId: object.id,
    id: user.id,
    username: user.get('username'),
    email: user.get('email'),
    nickName: user.get('nickName'),
    statusMessage: user.get('statusMessage'),
    profileFileUrl: profileFileUrl,
  };
}

module.exports = follows;
