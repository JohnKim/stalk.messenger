import faker from 'faker';
import Parse from 'parse/node';
import DataGenerator from './lib/dataGenerator';

var {SERVER_URL, APP_ID} = require('../env');

Parse.initialize(APP_ID);
Parse.serverURL = `${SERVER_URL}/parse`;

var Post = Parse.Object.extend('Post');
var Folder = Parse.Object.extend('Folder');

async function main() {

  // USERS (SIGN_UP)
  for (var index = 0; index < 60; index++) {
    await signup();
  }

  var folders = [
    {'name':'Paris', 'dateFrom': new Date(), 'dateTo':new Date(), 'tags':["B1","B2","B3"]},
    {'name':'Toyko', 'dateFrom': new Date(), 'dateTo':new Date(), 'tags':["B2","B3","B4"]},
    {'name':'Seoul', 'dateFrom': new Date(), 'dateTo':new Date(), 'tags':["B5","B2","B23"]},
    {'name':'NewYork', 'dateFrom': new Date(), 'dateTo':new Date(), 'tags':["B7","B2","B9"]},
    {'name':'Beijing', 'dateFrom': new Date(), 'dateTo':new Date(), 'tags':["B8","B2","B10"]}
  ];


  //  Post 정보 입력.
  for (var index = 0; index < 60; index++) {
    await new Post(getPostData()).save();
  }

  for (var index = 0; index < 5; index++) {
    console.log( folders[index] );
    await new Folder(folders[index]).save();
  }

  return 'OK';
}

main()
  .then(console.dir, console.error);


function signup() {
  var user = new Parse.User();

  // Essential values
  user.set("username",    faker.internet.userName()); // username
  user.set("password",    faker.internet.password()); // password

  // Additional values
  user.set("email",       faker.internet.email());    // email
  user.set("nickName",    faker.name.findName());     // nickName
  user.set("profileImage",faker.internet.avatar());   // profileImage

  user.signUp(null, {
    success: function(user) {
      console.log(user);
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      console.log("Error: " + error.code + " " + error.message);
    }
  });

}

function getPostData() {

  var point = new Parse.GeoPoint({latitude: 40.0, longitude: -30.0});

  let returnPostData = {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(),
    location: point
  };

  let resultArray = [];
  let count = faker.random.number({min: 1, max: 10});
  for (var index = 0; index < count; index++) {
    resultArray[index] = faker.random.word();
  }

  returnPostData['tags'] = resultArray;

  return returnPostData;
}

module.exports = { getPostData };
