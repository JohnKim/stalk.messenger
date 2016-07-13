
import Parse from 'parse/react-native';

export const LOADED_FOLLOWS   = 'LOADED_FOLLOWS';
export const ADDED_FOLLOWS    = 'ADDED_FOLLOWS';
export const REMOVED_FOLLOWS  = 'REMOVED_FOLLOWS';

const InteractionManager = require('InteractionManager');

const Follows = Parse.Object.extend('Follows');

export function loadFollows() {

  return (dispatch) => {

    var currentUser = Parse.User.current();
    
    new Parse.Query(Follows)
      .equalTo('userFrom', currentUser)
      .include('userTo')
      .find()
      .then(
        (list) => {

          InteractionManager.runAfterInteractions(() => {
            dispatch(({type: LOADED_FOLLOWS, list}));
          });

        },
        (error) => { console.warn(error); }
      );

  };

}

export function createFollow(username) {

  return (dispatch) => {
    return Parse.Cloud.run('follows:create', {username}, {
      success: (result) => {

        InteractionManager.runAfterInteractions(() => {
          dispatch(({type: ADDED_FOLLOWS, result}));
        });

      },
      error: (error) => {
        console.warn(error);
      }
    });
  };

}

export function removeFollow(username) {

  return (dispatch) => {
    return Parse.Cloud.run('follows:remove', {username}, {
      success: (result) => {

        InteractionManager.runAfterInteractions(() => {
          dispatch(({type: REMOVED_FOLLOWS, result}));
        });

      },
      error: (error) => {
        console.warn(error);
      }
    });
  };

}
