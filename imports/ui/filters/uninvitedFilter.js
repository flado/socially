import angular from 'angular';
import * as _ from 'underscore';

const name = 'uninvitedFilter';

function UninvitedFilter(users, party) {
  if (!party) {
    return false;
  }
  return _.filter(users, function(user) {
    return !(user._id === party.owner || _.contains(party.invited, user._id));
  });
}

export default angular.module(name, [])
  .filter(name, () => {
    return UninvitedFilter;
  });