import faker from 'faker';
import Parse from 'parse/node';
import Data from './lib/dataGenerator';

var argv = process.argv;

if(argv.length < 3) {
  throwError('   USAGE : babel-node verify-data [COMMAND] [Additional Options]');
}

var {SERVER_URL, APP_ID} = require('../env');

Parse.initialize(APP_ID);
Parse.serverURL = `${SERVER_URL}/parse`;

var Friends = Parse.Object.extend("Friends");

var notNullValue = function(value, fakerValue) {
  return value? value: fakerValue;
}

function createUser(username, password, email, nickName, profileImage) {

  var user = new Parse.User();

  // Essential values
  user.set("username",    notNullValue(username, faker.internet.userName())); // username
  user.set("password",    notNullValue(password, "password")); // password

  // Additional values
  user.set("email",       notNullValue(email, faker.internet.email()));    // email
  user.set("nickName",    notNullValue(nickName, faker.name.findName()));     // nickName
  user.set("profileImage",notNullValue(profileImage, faker.internet.avatar()));   // profileImage

  user.signUp(null, {
    success: function(user) {

      console.log(user.objectId);
      var query = new Parse.Query(Parse.User);
        query.get(user.id, {
          success: function(userAgain) {
            console.log(JSON.stringify(userAgain, null, '\t'));
          }
        });

    },
    error: function(user, error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
};

function createFriend(username, friend_username){

  var query = new Parse.Query(Parse.User);
  query.equalTo("username", friend_username);
  query.find({
    success: function(results) {
      if(results.length > 0) {
        var object = results[0];

        console.log(object);

        var friend = new Friends();
        friend.set("username", username); // 실제 존재해야만 하는 username
        friend.set("contact", object);

        friend.save(null, {
          success: function(friend) {
            console.log('New object created with objectId: ' + JSON.stringify(friend, null, '\t'));
          },
          error: function(friend, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
          }
        });
      } else {
        console.info(friend_username + ' was not existed.')
      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

}


function listFriend(username){

  var query = new Parse.Query(Friends);
  query.equalTo("username", username);
  query.include("contact");
  query.find({
    success: function(friends) {

      console.log(JSON.stringify(friends, null, '\t'));

      for (var i = 0; i < friends.length; i++) {
        // This does not require a network access.
        var friend = friends[i].get("contact");
        console.log(friend.get("username"));
        console.log(JSON.stringify(friend, null, '\t'));
      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

}

function listFriend2(username){

  var innerQuery = new Parse.Query(Friends);
  innerQuery.equalTo("username", username);
  innerQuery.select("contact");

  var query = new Parse.Query(Parse.User);
  query.matchesQuery("contact", innerQuery);
  query.find({
    success: function(users) {
      console.log(JSON.stringify(users, null, '\t'));
    }
  });

}



switch (argv[2]) {
  case "user:create":
    if(!argv[3]) {
      createUser();
    }else{
      createUser(argv[3]);
    }
    break;
  case "friend:create":
    if(!argv[3] || !argv[4]) throwError(' USAGE : babel-node verify-data friend:create [username] [firend\'s username]');
    createFriend(argv[3], argv[4]);
    break;
  case "friend:list":
    if(!argv[3]) throwError(' USAGE : babel-node verify-data friend:list [username] ');
    listFriend(argv[3]);
    break;
  case "Cherries":
    console.log("Cherries are $3.00 a pound.");
    break;
  case "Mangoes":
  case "Papayas":
    console.log("Mangoes and papayas are $2.79 a pound.");
    break;
  default:
    console.log("Sorry, we are out of " + argv[2] + ".");
}

function throwError(msg) {
  console.info('\n', msg || 'ERROR !! ', '\n');
  process.exit(0);
}



/*

var Post = Parse.Object.extend('Post');
var Folder = Parse.Object.extend('Folder');

async function main() {

  await createUser("test01");
  await createUser("test02");
  await createFakeUsers(3);
  return 'OK';
}

main()
  .then(console.dir, console.error);

  */
