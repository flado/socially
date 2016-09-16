import { Mongo } from 'meteor/mongo';

export const Parties = new Mongo.Collection('parties');

Parties.allow({
  insert: function(userId, party) {
    return userId && party.owner === userId;
  },

  update: function(userId, party, fields, modifier) {
    //allow public not-owned parties to be updated by anyone
    return (party.public && !party.owner) || (userId && party.owner === userId);
  },

  remove: function(userId, party) {
    //allow public not-owned parties to be updated by anyone
    return (party.public && !party.owner) || (userId && party.owner === userId);
  }
});

