
import Parse from 'parse/react-native';
import {updateInstallation} from './common';
import {loadFollows} from './follows';

export const SIGNED_UP  = 'SIGNED_UP';
export const LOGGED_IN  = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';

const InteractionManager = require('InteractionManager');
const constants = require('./_constants');

export function signup(data, callback) {

  return (dispatch) => {

    var user = new Parse.User();
    user.set("username", data.username);
    user.set("password", data.password);
    user.set("email", data.email);

    user.signUp(null, {
      success: function(user) {
        console.log(user);
        dispatch({
          type: SIGNED_UP,
          data: {
            username: user.username,
            email: user.email,
          },
        });
      },
      error: function(user, error) {
        callback(error);
        console.log("Error: " + error.code + " " + error.message);
      }
    });

  };
}

export function signin(data, callback) {

  return (dispatch) => {

    Parse.User.logIn(data.username, data.password, {
      success: function(user) {

        dispatch(loadFollows());

        dispatch({
          type: LOGGED_IN,
          data: user,
        });

      },
      error: function(user, error) {
        callback(error);
        console.log("Error: " + error.code + " " + error.message);
      }

    });

  };
}

export function logOut() {
  return (dispatch) => {
    Parse.User.logOut();
    updateInstallation({user: null, channels: []});

    // TODO: Make sure reducers clear their state
    return dispatch({
      type: LOGGED_OUT,
    });
  };
}

/**************************** DO NOT TRIGGERED ********************************/

// search user with username and email (startWith keyword)
// @params data = {keyword, pageNumber, pageSize}
export function searchUsersByPage(data, callback) {

  console.log(data);

  let limit = data.pageSize || constants.DEFAULT_PAGE_SIZE;
  let skip = ((data.pageNumber || 1) - 1) * limit;

  if(data.keyword) {
    let usernameQuery = new Parse.Query(Parse.User);
    usernameQuery.startsWith("username", data.keyword);

    let emailQuery = new Parse.Query(Parse.User);
    emailQuery.startsWith("email", data.keyword);

    let query = Parse.Query.or(usernameQuery, emailQuery); // TODO check new ??

    if(skip > 0) query = query.skip(skip);
    query = query.limit(limit).ascending('username');

    query.find({
      success: (list) => {
        callback(null, list);
      },
      error: (err) => {
        callback(err);
      },
    });
  } else{
    callback(null, []);
  }
}
