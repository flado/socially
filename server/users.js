Meteor.publish("users", function() {
  return Meteor.users.find({ username: undefined }, {
    fields: {
      emails: 1,
      profile: 1
    }
  });
});
