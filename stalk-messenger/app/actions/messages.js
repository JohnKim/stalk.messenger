/**
  * Messages
  *
  */
import Parse from 'parse/react-native';
import { SERVER_URL, APP_ID } from '../../env.js';

export const MESSAGE_SIZE     = 30;
export const LATEST_MESSAGE   = "LATEST_MESSAGE";

const InteractionManager = require('InteractionManager');

const Messages = Parse.Object.extend('Messages');
const Channels = Parse.Object.extend('Channels');

/**************************** DO NOT TRIGGERED ********************************/

/**
* Load messages into this channel
* @params chat (Chat Object)
**/
export  function loadMessages(chat, datetime) {

  var isFirstLoading = datetime ? false : true;

  return async (dispatch, getState) => {

    var promiseLoadMessages = new Promise( (resolve, reject) => {

      var channel = new Channels();
      channel.id = chat.channelId;

      /*console.log(
        'Conditions : '+ new Date(chat.createdAt) + " ~ " + (datetime ? new Date(datetime) : new Date())
      );*/

      new Parse.Query(Messages)
        .equalTo("channel", channel)
        .lessThan("createdAt", datetime ? new Date(datetime) : new Date())
        .greaterThan("createdAt", new Date(chat.createdAt))
        .descending("createdAt")
        .limit(MESSAGE_SIZE)
        .find()
        .then(
          (list) => {
            resolve(list.map(fromParseObject));
          },
          (error) => {
            console.warn(error);
            reject(error);
          }
        );
    });

    var promiseChannelNode = new Promise( (resolve, reject) => {

      if(isFirstLoading){

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

    var [messages, node] = await Promise.all([promiseLoadMessages, promiseChannelNode]);

    return {
      messages,
      node,
    };

  };

}

export function latestMessage(message) {
  return (dispatch) => {
    
    return dispatch({
      type: LATEST_MESSAGE,
      data: message,
    });

  };
}

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
