/**
  * Messages
  *
  */
import Parse from 'parse/react-native';

export const LOADED_MESSAGES   = 'LOADED_CHATS';

const InteractionManager = require('InteractionManager');

const Messages = Parse.Object.extend('Messages');

/**
* Load list of all chatting channels once logined
* @params
**/
export function loadMessages(id, datetime = new Date()) {

};
