
import Parse from 'parse/react-native';

export const LOADED_FOLLOWS   = 'LOADED_FOLLOWS';
export const ADDED_FOLLOWS    = 'ADDED_FOLLOWS';
export const REMOVED_FOLLOWS  = 'REMOVED_FOLLOWS';

const InteractionManager = require('InteractionManager');

const Follows = Parse.Object.extend('Follows');

/**
 * Load list of all follows once logined
 * @params N/A
 **/
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

/**
 * create follow relation
 * @params id : user.id of target user
 **/
export function createFollow(id) {

  return (dispatch) => {
    return Parse.Cloud.run('follows-create', {id}, {
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

/**
 * Remove follow relation
 * @params id : user.id of target user
 **/
export function removeFollow(id) {

  return (dispatch) => {
    return Parse.Cloud.run('follows-remove', {id}, {
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
