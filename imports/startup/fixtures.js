import * as _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { Parties } from '../api/parties';
import faker from 'faker';

Meteor.startup(() => {
  if (Parties.find().count() < 100) {
    _.each(_.range(100), function() {
      let party = {
        'name': faker.lorem.words(), //default to 3 words if nr not provided
        'description': faker.lorem.sentence(),
        'public': true
      };
      Parties.insert(party);
    });
  }
});


