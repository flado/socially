Meteor.publish('parties', function(options, searchString) { //a function to define what to publish from the server to the client
  if (!searchString || searchString === null) {
    searchString = '';
  }

  let selector = {
    name: {
      '$regex': '.*' + searchString || '' + '.*',
      '$options': 'i'
    },
    $or: [{
      $and: [{
        'public': true
      }, {
        'public': {
          $exists: true
        }
      }]
    }, {
      $and: [{
        owner: this.userId
      }, {
        owner: {
          $exists: true
        }
      }]
    }]
  };

  //noReady: publication will be ready only after our main cursor is ready
  Counts.publish(this, 'numberOfParties', Parties.find(selector), {
    noReady: true
  });
  if (options) {
    return Parties.find(selector, options);
  } else {
    return Parties.find(selector);
  }
});
