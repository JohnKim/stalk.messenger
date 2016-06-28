/**
 * User Reducer.
 */

import { LOGGED_IN, LOGGED_OUT, UPLOAD_PROFILE_IMAGE} from 's5-action';

const initialState = {
  isLoggedIn: false,
  profileImage: null,
  id: null,
  name: null,
};

function user(state = initialState, action) {

  if (action.type === LOGGED_IN) {
    let {id, name} = action.data;
    return {
      isLoggedIn: true,
      id,
      name,
    };
  }

  if (action.type === UPLOAD_PROFILE_IMAGE) {
    let {profileImage} = action.data;
    return { ...state, profileImage };
  }

  if (action.type === LOGGED_OUT) {
    return initialState;
  }

  return state;
}

module.exports = user;
