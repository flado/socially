import Meteor from 'meteor/meteor';

if (Meteor.isServer) {
  /*Meteor.publish('users', function() {
    return Meteor.users.find({}, {
      fields: {
        emails: 1,
        profile: 1
      }
    });
  });*/

  Meteor.publish("users", function() {
    return Meteor.users.find({ /*username: undefined*/ }, {
      fields: {
        emails: 1,
        username: 1,
        profile: 1
      }
    });
  });

}


