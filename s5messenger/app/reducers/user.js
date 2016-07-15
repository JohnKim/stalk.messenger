/**
 * User Reducer.
 */

import { LOGGED_IN, LOGGED_OUT, SIGNED_UP} from 's5-action';

const initialState = {
  isLoggedIn: false,
  username: null,
  email: null,
  nickName: null,
  profileImage: null,
};

function user(state = initialState, action) {

  if (action.type === LOGGED_IN || action.type === SIGNED_UP) {
    let {username, email, nickName, profileImage} = fromParseObject(action.data);

    return {
      isLoggedIn: true,
      username,
      email,
      nickName,
      profileImage,
    };
  }

  if (action.type === LOGGED_OUT) {
    return initialState;
  }

  return state;
}

function fromParseObject(user){
  return {
    id: user.id,
    username: user.get('username'),
    email: user.get('email'),
    nickName: user.get('nickName'),
    profileImage: user.get('profileImage')
  };
}

module.exports = user;
