/**
  * Chats, Channels
  *
  */
import Parse from 'parse/react-native';
import { loadFollows }        from './follows';
import { loadChats }          from './chats';

const InteractionManager = require('InteractionManager');

const Chats = Parse.Object.extend('Chats');
const Channels = Parse.Object.extend('Channels');
const Follows = Parse.Object.extend('Follows');

var initDatas = async function (dispatch) {

  try {
    console.log('0001. ')
      await Promise.all([
        dispatch(loadFollows()),
        dispatch(loadChats()),
        timeout(15000),
      ]);
      console.log('0002. ')
    } catch (e) {
      const message = e.message || e;
      if (message !== 'Timed out' && message !== 'Canceled by user') {
        console.warn(e);
      }else{
        console.log(e);
      }
      return;
    } finally {
      console.log('done!!!');
    }

};

var timeout = async function (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timed out')), ms);
  });
}

export function testAsync2() {

  return (dispatch, getState) => {

    console.log('STEP 1');

    dispatch( loadFollows() ).then(
      (sauce) => {
        console.log('STEP 2');
        return dispatch( loadChats() );
      },
      (error) => {
        console.log(error);
      }
    ).then(
      (sauce) => {
        console.log('STEP 3');
        return dispatch( loadFollows() );
      },
      (error) => {
        console.log(error);
      }
    ).then(
      (sauce) => {
        console.log('DONE');
      }
    );

  }
}

export function testAsync() {

  return (dispatch, getState) => {

    var currentUser = Parse.User.current();
    // console.log('1. ', currentUser.id, currentUser.username);

    return new Parse.Query(Follows)
      .equalTo('userFrom', currentUser)
      .include('userTo')
      .find().then(
        (list) => {

          //console.log('STEP 0');
          //console.log(getState());
          console.log('STEP 1');

          return dispatch( loadFollows() ).then(
            (sauce) => {
              console.log('STEP 2');
              return dispatch( loadChats() );
            },
            (error) => {
              console.log(error);
            }
          ).then(
            (sauce) => {
              console.log('STEP 3');
              return dispatch( loadFollows() );
            },
            (error) => {
              console.log(error);
            }
          );
          console.log('STEP 4');

        },
        (error) => { console.log(error); }
      );
    console.log('dddddone!');

  };
}
