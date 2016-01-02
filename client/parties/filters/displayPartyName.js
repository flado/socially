angular.module('socially').filter('displayPartyName', function() {
  let result = '';

  return function(party) {
    if (!party) {
      return result;
    }

    if (party.name) {
      result = party.name;
    }
    if (party.public) {
      result = result + '  ( public )';
    } else {
      result = result + '  ( private )';
    }
    return result;
  };
});
