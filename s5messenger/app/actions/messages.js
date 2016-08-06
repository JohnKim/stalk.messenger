/**
  * Messages
  *
  */
import Parse from 'parse/react-native';

export const MESSAGE_SIZE     = 50;
export const LOADED_MESSAGES  = 'LOADED_MESSAGES';

const InteractionManager = require('InteractionManager');

const Messages = Parse.Object.extend('Messages');

/**
* Load all messages into this channel
* @params id (channel id)
**/
export function loadMessages(chat, datetime = new Date()) {

  return (dispatch, getState) => {

    return new Promise( (resolve, reject) => {

      new Parse.Query(Messages)
        .equalTo("channel", chat.channelId)
        .lessThanOrEqualTo("createdAt", datetime)
        .greaterThan("createdAt", chat.createdAt)
        .limit(MESSAGE_SIZE)
        .descending("createdAt")
        .find()
        .then(
          (list) => {
            resolve(list);
          },
          (err) => {
            console.error(error);
            reject(err);
          }
        );
    });

  };

};
