/**
  * Chats, Channels
  *
  */
import Parse from 'parse/react-native';
import { SERVER_URL, APP_ID } from '../../env.js';

export const LOADED_CHATS     = 'LOADED_CHATS';
export const ADDED_CHAT       = 'ADDED_CHAT';
export const ADDED_TEMP_CHAT  = 'ADDED_TEMP_CHAT';
export const REMOVED_CHATS    = 'REMOVED_CHATS';

const InteractionManager = require('InteractionManager');

const Chats = Parse.Object.extend('Chats');


function loadChannelNode (channelId) {

  return new Promise( (resolve, reject) => {

    fetch( SERVER_URL + '/node/' + APP_ID + '/' + channelId )
      .then((response) => response.json())
      .then((responseJson) => {
        if( responseJson.status == 'ok' ) {
          resolve({
            app: APP_ID,
            name: responseJson.result.server.name,
            url: responseJson.result.server.url
          });
        }else{
          console.warn(responseJson);
          reject(responseJson);
        }

      })
      .catch((error) => {
        console.warn(error);
        reject(error);
      });
  });

}

function loadChatsAsync () {

  return new Promise( (resolve, reject) => {

    var currentUser = Parse.User.current();

    new Parse.Query(Chats)
      .equalTo('user', currentUser)
      .include('channel.users')
      .descending("updatedAt")
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

function createChatAsync (users) {

  return new Promise( (resolve, reject) => {

    let ids = [];
    users.forEach( function(user) {
       ids.push(user.id);
    } );

    Parse.Cloud.run('chats-create', { ids }).then(
      (result) => {
        resolve(result);
      },
      (err) => { console.error(error); reject(err); }
    );
  });

}

function addUserToChat (channelId, ids) {

  var param = {};
  if (typeof id == 'string' || id instanceof String) {
    param.id = id;
  } else if (typeof id == 'object') {
    if (Array.isArray(id)) {
      param.ids = id;
    }
  }

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

export function createTempChat(users) {

  return (dispatch, getState) => {

    var currentUser = Parse.User.current();

    // chat id for temp chat data !
    let chatId = users.length == 1 ? users[0].id : new Date().valueOf();

    var chat = null;

    if(users.length == 1) {
      getState().chats.list.forEach( function(obj) {
         if( obj.id == chatId ) {
           chat = obj;
         }
      } );
    }

    if(!chat){
      dispatch({
        type: ADDED_TEMP_CHAT,
        user: currentUser,
        id: chatId,
        users,
      });

      getState().chats.list.forEach( function(obj) {
         if( obj.id == chatId ) {
           chat = obj;
         }
      } );

    }

    return Promise.resolve(chat);

  };

}

/**
 * create chatting channel
 * @params id : user.id of target user
 **/
export function createChat(chatId, users) {

  return async (dispatch, getState) => {

    var result = await createChatAsync(users);

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
        type: ADDED_CHAT,
        beforeId: chatId,
        user: currentUser,
        chat
      });

      getState().chats.list.forEach( function(obj) {
         if( obj.id == chat.id ) {
           chat = obj;
         }
      } );

    }

    let node = await loadChannelNode(chat.channelId);

    return Promise.resolve({
      chat,
      node,
    });

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
