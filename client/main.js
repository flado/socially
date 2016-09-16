
import 'bootstrap/dist/css/bootstrap.min.css';

// import 'angular2-meteor-polyfills/browser';
import * as angular from 'angular';
//import { upgradeAdapter } from '../imports/ui/upgradeAdapter';

import { Meteor } from 'meteor/meteor';
import Socially from '../imports/ui/components/socially/socially.component';

function onReady() {
  // upgradeAdapter.bootstrap(document.body, [
  angular.bootstrap(document.body, [
    Socially.name
  ], {
    strictDi: true
  });
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}



/*

angular.module('socially', [
  'angular-meteor',
  'ui.router',
  'accounts.ui',
  'angularUtils.directives.dirPagination',
  'ui.bootstrap',
  'uiGmapgoogle-maps'
]);

function onReady() {
  angular.bootstrap(document, ['socially'], {
    strictDi: true
  });
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}

*/