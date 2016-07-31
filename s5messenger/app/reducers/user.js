/**
 * User Reducer.
 */

import { LOGGED_IN, LOGGED_OUT, SIGNED_UP, UPLOAD_PROFILE_IMAGE} from 's5-action';

const initialState = {
  isLoggedIn: false,
  id:null,
  username: null,
  email: null,
  nickName: null,
  profileImage: null,
  statusMessage:null
};

function user(state = initialState, action) {

  if (action.type === LOGGED_IN || action.type === SIGNED_UP) {
    let {id, username, email, nickName, profileImage, statusMessage} = fromParseObject(action.data);

    return {
      isLoggedIn: true,
      id,
      username,
      email,
      nickName,
      profileImage,
      statusMessage
    };
  }

  if (action.type === LOGGED_OUT) {
    return initialState;
  }

  if (action.type === UPLOAD_PROFILE_IMAGE) {
    let {profileImage} = action.data;
    return { ...state, profileImage };
  }

  return state;
}

function fromParseObject(user){

  var profileImage = "";
  if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
    profileImage = user.get('profileFile').url();
  }

  return {
    id: user.id,
    username: user.get('username'),
    email: user.get('email'),
    nickName: user.get('nickName'),
    profileImage: profileImage,
    statusMessage: user.get('statusMessage'),
  };
}

module.exports = user;
