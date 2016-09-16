import angular from 'angular';

const name = 'displayPartyNameFilter';

function DisplayPartyNameFilter(party) {
  let result = '';

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
}

export default angular.module(name, [])
  .filter(name, () => {
    return DisplayPartyNameFilter;
  });