/**
 * User Reducer.
 */

import { LOGGED_IN, LOGGED_OUT, SIGNED_UP} from 's5-action';

const initialState = {
  isLoggedIn: false,
  profileImage: null,
  id: null,
  name: null,
};

function user(state = initialState, action) {

  if (action.type === LOGGED_IN || action.type === SIGNED_UP) {
    let {id, name} = action.data;
    return {
      isLoggedIn: true,
      id,
      name,
    };
  }

  if (action.type === LOGGED_OUT) {
    return initialState;
  }

  return state;
}

module.exports = user;