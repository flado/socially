Meteor.startup(function() {
  if (Parties.find().count() < 100) {
    _.each(_.range(100), function() {
      let party = {
        'name': faker.lorem.words().join(' '),
        'description': faker.lorem.sentence(),
        'public': true
      };
      
      Parties.insert(party);
    });
  }
});
