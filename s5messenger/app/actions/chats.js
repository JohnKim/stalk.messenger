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

          console.log(list);

          InteractionManager.runAfterInteractions(() => {
            dispatch(({type: LOADED_CHATS, list}));
          });

        },
        (error) => { console.warn(error); }
      );

  };

}

export function createChat(userId) {

  return (dispatch) => {

    var currentUser = Parse.User.current();

    var query = new Parse.Query(Channels);
    query.containsAll("users", [currentUser, ]);
    query.descending("gpa");
    query.first().then(function(channel) {
      students[0].set("valedictorian", true);
      // Force this callback to fail.
      return Parse.Promise.error("There was an error.");

    }).then(function(valedictorian) {
      // Now this will be skipped.
      return query.find();

    }).then(function(students) {
      // This will also be skipped.
      students[1].set("salutatorian", true);
      return students[1].save();
    }, function(error) {
      // This error handler WILL be called. error will be "There was an error.".
      // Let's handle the error by returning a new promise.
      return Parse.Promise.as("Hello!");

    }).then(function(hello) {
      // Everything is done!
    }, function(error) {
      // This isn't called because the error was already handled.
    });


    return Parse.Cloud.run('follows:create', {username}, {
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

export function removeChat(username) {

  return (dispatch) => {
    return Parse.Cloud.run('follows:remove', {username}, {
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
