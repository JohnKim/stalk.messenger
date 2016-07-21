/**
  * Chats, Channels
  *
  */
import Parse from 'parse/react-native';

export const LOADED_CHATS   = 'LOADED_CHATS';
export const ADDED_CHATS    = 'ADDED_CHATS';
export const REMOVED_CHATS  = 'REMOVED_CHATS';

const InteractionManager = require('InteractionManager');

const Chats = Parse.Object.extend('Chats');
const Channels = Parse.Object.extend('Channels');

/**
 * Load list of all chatting channels once logined
 * @params N/A
 **/
export function loadChats() {

  return (dispatch) => {

    var currentUser = Parse.User.current();

    new Parse.Query(Chats)
      .equalTo('user', currentUser)
      .include('channel.users')
      .find()
      .then(
        (list) => {

          InteractionManager.runAfterInteractions(() => {
            dispatch(({
              type: LOADED_CHATS,
              user: currentUser,
              list,
            }));
          });

        },
        (error) => { console.warn(error); }
      );

  };

}

async function queryFacebookAPI(path, ...args) {
  return new Promise((resolve, reject) => {
    FacebookSDK.api(path, ...args, (response) => {
      if (response && !response.error) {
        resolve(response);
      } else {
        reject(response && response.error);
      }
    });
  });
}




/**
 * create chatting channel
 * @params id : user.id of target user
 **/
export function createChats(id) {

  return (dispatch) => {
    return Parse.Cloud.run('chats-create', {id}, {
      success: (result) => {

        InteractionManager.runAfterInteractions(() => {
          dispatch(({type: ADDED_CHATS, result}));
        });

      },
      error: (error) => {
        console.warn(error);
      }
    });
  };

}

/**
 * Remove(leave) chatting channel
 * @params id : user.id of target user
 **/
export function removeChats(id) {

  return (dispatch) => {

    // TODO disconnect socket first.

    return Parse.Cloud.run('chats-remove', {id}, {
      success: (result) => {

        InteractionManager.runAfterInteractions(() => {
          dispatch(({type: REMOVED_CHATS, result}));
        });

      },
      error: (error) => {
        console.warn(error);
      }
    });
  };

}
