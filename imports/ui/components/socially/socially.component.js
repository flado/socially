import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import PartiesList from '../partiesList/partiesList.component';
import PartyDetails from '../partyDetails/partyDetails.component';
import Navigation from '../navigation/navigation.component';
import templateUrl from './socially.html';


class Socially {}

const name = 'socially';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    PartiesList.name,
    PartyDetails.name,
    Navigation.name,
    'accounts.ui'
  ])
  .component(name, {
    templateUrl,
    controllerAs: name,
    controller: Socially
  })
  .config(config)
  .run(run);

function config($locationProvider, $urlRouterProvider) {
  'ngInject';
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/parties');
}

function run($rootScope, $state) {
  'ngInject';
  $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
    if (error === 'AUTH_REQUIRED') {
      console.log('AUTH_REQUIRED');
      $state.go('parties');
    }
  });
}