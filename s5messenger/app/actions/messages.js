/**
  * Messages
  *
  */
import Parse from 'parse/react-native';
import { SERVER_URL, APP_ID } from '../../env.js';

export const MESSAGE_SIZE     = 50;

const InteractionManager = require('InteractionManager');

const Messages = Parse.Object.extend('Messages');
const Channels = Parse.Object.extend('Channels');

/**************************** DO NOT TRIGGERED ********************************/

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

      var channel = new Channels();
      channel.id = chat.channelId;

      new Parse.Query(Messages)
        .equalTo("channel", channel)
        //.lessThanOrEqualTo("createdAt", lastedLoadedDate)
        //.greaterThan("createdAt", chat.createdAt)
        .limit(MESSAGE_SIZE)
        .descending("createdAt")
        .find()
        .then(
          (list) => {
            resolve(list);
          },
          (error) => {
            console.warn(error);
            reject(error);
          }
        );
    });

    var promiseChannelNode = new Promise( (resolve, reject) => {

      if(isFistLoading){

        fetch( SERVER_URL + '/node/' + APP_ID + '/' + chat.channelId )
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

      } else {

        resolve({});

      }

    });

    var [messagesObj, node] = await Promise.all([promiseLoadMessages, promiseChannelNode]);

    var messages = messagesObj.map(fromParseObject);

    return {
      messages,
      node,
    };

  };

};

function fromParseObject(obj){

  return {
    _id: obj.id,
    text: obj.get("message"),
    createdAt: obj.createdAt,
    user: {
      _id: obj.get("user").id
    }
  };
}
