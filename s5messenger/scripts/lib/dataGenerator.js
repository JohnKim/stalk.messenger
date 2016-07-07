import faker from 'faker';
import Parse from 'parse/node';

var notNullValue = function(value, fakerValue) {
  return value? value: fakeValue;
}

export signup = function(username, password, email, nuckName, profileImage) {
  var user = new Parse.User();

  // Essential values
  user.set("username",    notNullValue(username, faker.internet.userName())); // username
  user.set("password",    notNullValue(password, faker.internet.password())); // password

  // Additional values
  user.set("email",       notNullValue(email, faker.internet.email()));    // email
  user.set("nickName",    notNullValue(nickName, faker.name.findName()));     // nickName
  user.set("profileImage",notNullValue(profileImage, faker.internet.avatar()));   // profileImage

  return user;
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
