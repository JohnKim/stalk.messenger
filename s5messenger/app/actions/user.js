
import {
  Platform,
  Alert,
  ActionSheetIOS,
  InteractionManager,
} from 'react-native';

import Parse from 'parse/react-native';
import {updateInstallation} from './common';

export const SIGNED_UP    = 'SIGNED_UP';
export const LOGGED_IN  = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';

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

        return dispatch({
          type: LOGGED_IN,
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
