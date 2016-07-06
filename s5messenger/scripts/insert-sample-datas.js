import faker from 'faker';
import Parse from 'parse/node';
import Data from './lib/dataGenerator';

var {SERVER_URL, APP_ID} = require('../env');

Parse.initialize(APP_ID);
Parse.serverURL = `${SERVER_URL}/parse`;

var Post = Parse.Object.extend('Post');
var Folder = Parse.Object.extend('Folder');

async function main() {

  await createUser("test01");
  await createUser("test02");
  await createFakeUsers(3);

/*
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
*/
  return 'OK';
}

main()
  .then(console.dir, console.error);

/* ******************************************************************* */

async function createFakeUsers(num) {

  var maxNum = num || 5;

  for (var index = 0; index < maxNum; index++) {
    await Data.signup().signUp(null, {
      success: function(user) {
        console.log(user);
      },
      error: function(user, error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  }
};


async function createUser(username, password, email, nickName, profileImage) {

  await Data.signup(username, password, email, nickName, profileImage).signUp(null, {
    success: function(user) {
      console.log(user);
    },
    error: function(user, error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
};
