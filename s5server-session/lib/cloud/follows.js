
var Follows = Parse.Object.extend('Follows');

Parse.Cloud.define('follows', function(request, response) {
  Parse.Cloud.useMasterKey();

  var user = request.user;
  if (!user) {
    return response.success([]);
  }

  new Parse.Query(Follows)
    .equalTo('userFrom', user)
    .include('userTo')
    .find()
    .then(
      (value) => { response.success(value); },
      (error) => { response.error(error); }
    );

});


Parse.Cloud.define('follows-create', function(request, response) {
  Parse.Cloud.useMasterKey();

  var currentUser = request.user;
  if (!currentUser) {
    return response.error({message: 'Not logged in'});
  }

  var params = request.params;
  if (!params.username) {
    return response.error({message: 'Need username for following.'});
  }

  new Parse.Query(Parse.User)
    .equalTo("username", params.username)
    .first()
    .then(
      (user) => {
        if(user) {
          var follow = new Follows();
          follow.set("userFrom", currentUser);
          follow.set("userTo", user);

          follow.save(null, {
            success: function(follow) {
              return response.success(user);
            },
            error: function(follow, error) {
              return response.error(error);
            }
          });
        } else {
          return response.error({message: params.username + ' was not existed.'});
        }

      },
      (error) => { response.error(error); }
    );
});


Parse.Cloud.define('follow-remove', function(request, response) {
  Parse.Cloud.useMasterKey();

  var currentUser = request.user;
  if (!currentUser) {
    return response.error({message: 'Not logged in'});
  }

  var params = request.params;
  if (!params.username) {
    return response.error({message: 'Need username for following.'});
  }

  new Parse.Query(Parse.User)
    .equalTo("username", params.username)
    .first()
    .then(
      (user) => {

        if(user) {

          new Parse.Query(Follows)
            .equalTo('userFrom', currentUser)
            .equalTo('userTo', user)
            .first()
            .then(
              (result) => {
                result.destory();
                response.success(result);
              },
              (error) => { response.error(error); }
            );

        } else {
          return response.error({message: params.username + ' was not existed.'});
        }

      },
      (error) => { response.error(error); }
    );
});
