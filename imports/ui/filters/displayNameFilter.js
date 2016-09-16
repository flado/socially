import angular from 'angular';

const name = 'displayNameFilter';

function DisplayNameFilter(user) {
  if (!user) {
    return '';
  }

  if (user.profile && user.profile.name) {
    return user.profile.name;
  } else if (user.emails) {
    return user.emails[0].address;
  } else if (user.username) {
    return user.username;
  } else {
    return user;
  }
}

export default angular.module(name, [])
  .filter(name, () => {
    return DisplayNameFilter;
  });