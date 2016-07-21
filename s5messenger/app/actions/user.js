
import Parse from 'parse/react-native';

import { updateInstallation } from './common';
import { loadFollows }        from './follows';
import { loadChats }          from './chats';

export const SIGNED_UP  = 'SIGNED_UP';
export const LOGGED_IN  = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';

const InteractionManager  = require('InteractionManager');
const constants           = require('./_constants');

/**
 * sign up
 * @params data: { username, password, email }
 **/
export function signup(data, callback) {

  return (dispatch) => {

    var user = new Parse.User();
    user.set("username", data.username);
    user.set("password", data.password);
    user.set("email", data.email);
    user.set("nickName", data.username);

    user.signUp(null, {
      success: function(user) {
        console.log(user);
        dispatch({
          type: SIGNED_UP,
          data: {
            username: user.username,
            email: user.email,
            nickName: data.username,
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

/**
 * sign in (login)
 * @params data: { username, password }
 **/
export function signin(data, callback) {

  return (dispatch) => {

    Parse.User.logIn(data.username, data.password, {
      success: function(user) {

        dispatch( loadFollows() ).then(
          (sauce) => dispatch( loadChats() ),
          (error) => callback(error)
        ).then(
          (sauce) => dispatch({
            type: LOGGED_IN,
            data: user,
          }),
          (error) => callback(error)
        );

      },
      error: function(user, error) {
        console.log("Error: " + error.code + " " + error.message);
        callback(error);
      }

    });

  };
}

/**
 * logout
 * @params N/A
 **/
export function logOut() {
  return (dispatch) => {

    Parse.User.logOut();
    updateInstallation({user: null, channels: []});

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
