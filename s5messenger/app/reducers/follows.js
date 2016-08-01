/**
 * Follows Reducer
 */

import { LOADED_FOLLOWS, ADDED_FOLLOWS, REMOVED_FOLLOWS, LOGGED_OUT } from 's5-action';
import { follow2Json } from './parser';

const initialState = {
  list: [],
  lastLoadedAt: null,
};

function follows(state = initialState, action) {

  if (action.type === LOADED_FOLLOWS) {
      let list = action.list.map(follow2Json);
      return {
        list,
        lastLoadedAt: new Date(),
      };
  }

  if (action.type === REMOVED_FOLLOWS) {
      let newData = [...state.list];
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

module.exports = follows;
