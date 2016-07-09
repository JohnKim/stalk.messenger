import faker from 'faker';
import Parse from 'parse/node';

var notNullValue = function(value, fakerValue) {
  return value? value: fakerValue;
}

exports.user = function(username, password, email, nickName, profileImage) {
  var user = new Parse.User();

  // Essential values
  user.set("username",    notNullValue(username, faker.internet.userName())); // username
  user.set("password",    notNullValue(password, "password")); // password

  // Additional values
  user.set("email",       notNullValue(email, faker.internet.email()));    // email
  user.set("nickName",    notNullValue(nickName, faker.name.findName()));     // nickName
  user.set("profileImage",notNullValue(profileImage, faker.internet.avatar()));   // profileImage

  return user;
}

exports.friend = function(username, friend_username) {

  var query = new Parse.Query(Parse.User);
  query.equalTo("username", friend_username);
  query.find({
    success: function(results) {
        console.log(JSON.stringify(results, null, '\t'));
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          console.log(object.id + ' - ' + object);
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

}

/*

faker.locale = "en";

console.log(' > USERS');

console.log(faker.internet.userName()); // username
console.log(faker.internet.password()); // password
console.log(faker.internet.email());    // email
console.log(faker.name.findName());     // nickName
console.log(faker.internet.avatar());   // profileImage

console.log(' > MESSAGES');
console.log(faker.lorem.sentence());

*/
