/**
 * Chat datas for Chats Tab
 */
import { LOADED_CHATS, ADDED_CHATS, REMOVED_CHATS, LOGGED_OUT } from 's5-action';
import { chat2Json } from './parser';

const initialState = {
  list: [],
  lastLoadedAt: null,
};

let currentUser = null; // to emit current user data into chat users of the channel.

function follows(state = initialState, action) {

  if (action.type === LOADED_CHATS) {
      currentUser = action.user; // to emit current user data into chat users of the channel.
      let list = action.list.map(chat2Json);

      return {
        list,
        lastLoadedAt: new Date(),
      };

  } else if (action.type === ADDED_CHATS) {

    currentUser = action.user;

    let chat = chat2Json(action.chat);
    let newData = [...state.list];
    newData.unshift(chat);

    return {
      list: newData,
      lastLoadedAt: new Date(),
    };

  } else if (action.type === REMOVED_CHATS) {

      let newData = [...state.list];
      newData.splice(action.row, 1);

      return {
        list: newData,
        lastLoadedAt: new Date(),
      };

  } else if (action.type === LOGGED_OUT) {
    return initialState;
  }

  return state;
}

module.exports = follows;
