/**
  * Messages
  *
  */
import Parse from 'parse/react-native';
import { SERVER_URL, APP_ID } from '../../env.js';

export const MESSAGE_SIZE     = 50;
export const LOADED_MESSAGES  = 'LOADED_MESSAGES';

const InteractionManager = require('InteractionManager');

const Messages = Parse.Object.extend('Messages');

/**
* Load messages into this channel
* @params chat (Chat Object)
**/
export  function loadMessages(chat, datetime) {

  var isFistLoading = datetime ? false : true;

  return async (dispatch, getState) => {

    var promiseLoadMessages = new Promise( (resolve, reject) => {

      var lastedLoadedDate = new Date();
      if(datetime) lastedLoadedDate = datetime;

      new Parse.Query(Messages)
        .equalTo("channel", chat.channelId)
        .lessThanOrEqualTo("createdAt", lastedLoadedDate)
        .greaterThan("createdAt", chat.createdAt)
        .limit(MESSAGE_SIZE)
        .descending("createdAt")
        .find()
        .then(
          (list) => {
            resolve(list);
          },
          (error) => {
            console.error(error);
            reject(error);
          }
        );
    });

    var promiseChannelNode = new Promise( (resolve, reject) => {

      if(isFistLoading){

        fetch(SERVER_URL+'/node/'+APP_ID+'/'+chat.channelId)
          .then((response) => response.json())
          .then((responseJson) => {
            if( responseJson.status == 'ok' ) {
              resolve({
                name: responseJson.result.server.name,
                url: responseJson.result.server.url
              });
            }else{
              console.log(responseJson);
              reject(responseJson);
            }

          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });

      } else {

        resolve({});

      }

    });

    var [messages, node] = await Promise.all([promiseLoadMessages, promiseChannelNode]);
console.log(messages, node);
    return {
      messages,
      node,
    };

  };

};
