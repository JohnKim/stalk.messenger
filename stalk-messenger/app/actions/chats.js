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

}

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

}


function createChatAsync (ids) {

  return new Promise( (resolve, reject) => {

    Parse.Cloud.run('chats-create', { ids }).then(
      (result) => {
        resolve(result);
      },
      (err) => { console.error(error); reject(err); }
    );
  });

}

function addUserToChat (channelId, ids) {

  return new Promise( (resolve, reject) => {

    Parse.Cloud.run('chats-add', { channelId, ids }).then(
      (result) => {
        resolve(result);
      },
      (err) => { console.error(error); reject(err); }
    );
  });

}


/**
 * Load list of all chatting channels once logined
 * @params N/A
 **/
export function loadChats() {

  return async (dispatch) => {

    var currentUser = Parse.User.current();

    var list = await loadChatsAsync();

    return dispatch({
      type: LOADED_CHATS,
      user: currentUser,
      list,
    });

  };

}


/**
 * create chatting channel
 * @params id : user.id of target user
 **/
export function createChat(ids) {

  return async (dispatch, getState) => {

    var result = await createChatAsync(ids);

    var chat = null;
    getState().chats.list.forEach( function(obj) {
       if( obj.id == result.id ) {
         chat = obj;
       }
    } );

    if(!chat) {

      var currentUser = Parse.User.current();
      chat = await loadChatByIdAsync(result.id);

      dispatch({
        type: ADDED_CHATS,
        user: currentUser,
        chat
      });

      getState().chats.list.forEach( function(obj) {
         if( obj.id == chat.id ) {
           chat = obj;
         }
      } );

    }

    return Promise.resolve(chat);

  };

}

/**
 * Remove(leave) chatting channel
 * @params id : user.id of target user
 **/
export function removeChat(row) {

  return (dispatch, getState) => {

    let chatId = getState().chats.list[row].id;

    return Parse.Cloud.run('chats-remove', { id: chatId }, {
      success: (result) => {

        InteractionManager.runAfterInteractions(() => {

          dispatch({
            type: REMOVED_CHATS,
            result,
            row
          });

          return Promise.resolve(row);

        });

      },
      error: (error) => {
        console.warn(error);
      }
    });
  };

}

// TODO 개발 중 ( 최초 메시지를 날리면 이걸 호출해서 Chats 에 데이터를 생성해야 함 ! ! )
export function addUsers(channelId, ids) {

 return async (dispatch, getState) => {

   var result = await addUserToChat(channelId, ids);

   return Promise.resolve(result);
   
 };

}
