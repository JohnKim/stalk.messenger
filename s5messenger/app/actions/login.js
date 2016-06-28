
import {
  Platform,
  Alert,
  ActionSheetIOS,
  InteractionManager,
} from 'react-native';
import Parse from 'parse/react-native';
import {updateInstallation} from './common';

export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';

export function login(username, password) {

  Parse.User.logIn(username, password, {
    success: function(user) {

      return dispatch({
        type: LOGGED_IN,
        data: {
          id: user.username,
          email: user.email,
        },
      });

    },
    error: function(user, error) {
      // The login failed. Check error to see why.
    }

  });

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
