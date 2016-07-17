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
            dispatch(({type: LOADED_CHATS, list}));
          });

        },
        (error) => { console.warn(error); }
      );

  };

}

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

export function removeChats(username) {

  return (dispatch) => {
    return Parse.Cloud.run('chats-remove', {username}, {
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
