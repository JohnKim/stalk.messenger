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

function loadChatsAsync () {

  return new Promise( (resolve, reject) => {

    var currentUser = Parse.User.current();

    new Parse.Query(Chats)
      .equalTo('user', currentUser)
      .include('channel.users')
      .find()
      .then(
        (list) => {
          resolve(list);
        },
        (err) => { console.error(error); reject(err); }
      );
  });

};

function loadChatByIdAsync (id) {

  return new Promise( (resolve, reject) => {

    new Parse.Query(Chats)
      .include('channel.users')
      .get(id, {
        success: function(chat) {
          resolve(chat);
        },
        error: function(object, error) {
          console.error(error);
          reject(err);
        }
      });
  });

};

/**
 * Load list of all chatting channels once logined
 * @params N/A
 **/
export function loadChats() {

  return async (dispatch) => {

    var currentUser = Parse.User.current();

    var list = await loadChatsAsync();

    return dispatch(({
              type: LOADED_CHATS,
              user: currentUser,
              list,
            }));

  };

}

/**
 * create chatting channel
 * @params id : user.id of target user
 **/
export function createChat(id) {

  return (dispatch, getState) => {

    // @ TODO check if existed.
    // if (getState().chats.lists[].user[].id == id) then FAILED !!

    return Parse.Cloud.run('chats-create', {id}, {
      success: async (result) => {

        var currentUser = Parse.User.current();
        var chat = await loadChatByIdAsync(result.id);

        return dispatch(({
          type: ADDED_CHATS,
          user: currentUser,
          chat
        }));

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
export function removeChat(id) {

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
