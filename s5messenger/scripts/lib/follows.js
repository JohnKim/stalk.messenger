import Parse  from 'parse/node';
import faker  from 'faker';
import Common from './_common';
import response from './_response';

var Follows = Parse.Object.extend("Follows");

exports.create = async function (username, targetUsername) {

  var currentUser = new Parse.User();
  currentUser.id = await Common.getUserId(username);

  var user = new Parse.User();
  user.id = await Common.getUserId(targetUsername);

  var follow = new Follows();
  follow.set("userFrom", currentUser);
  follow.set("userTo", user);
  follow.save()
  .then(
    (value) => { response.success(value); },
    (error) => { response.error(error); }
  );

};

exports.load = async function (username) {

  var currentUser = new Parse.User();
  currentUser.id = await Common.getUserId(username);

  new Parse.Query(Follows)
    .equalTo('userFrom', currentUser)
    .include('userTo')
    .find().then(
      (list) => {
        list.map(followsParseObject);
      },
      (error) => { console.log(error); }
    );
};

exports.remove = async function (username, targetUsername) {

  var currentUser = new Parse.User();
  currentUser.id = await Common.getUserId(username);

  var user = new Parse.User();
  user.id = await Common.getUserId(targetUsername);

  new Parse.Query(Follows)
    .equalTo('userFrom', currentUser)
    .equalTo('userTo', user)
    .first()
    .then(
      (result) => {

        if(result) {
          result.destroy().then(
            (object) => { console.log(object); },
            (error) => { console.log(error); }
          );
        } else {
          console.log('not existed.');
        }

      },
      (error) => { console.log(error); }

    );
};

function followsParseObject(object){
  var user = object.get('userTo');
  console.log ({
    id: object.id,
    username: user.get('username'),
    email: user.get('email'),
  });
}
