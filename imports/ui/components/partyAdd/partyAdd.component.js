import * as _ from 'underscore';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './partyAdd.html';
import { Meteor } from 'meteor/meteor';
import { Parties } from '../../../api/parties';

class PartyAdd {
  constructor($scope, $stateParams, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({
      isLoggedIn: () => {
        return Meteor.userId() !== null;
      }
    });

    this.newParty = {};

    this.addNewParty = () => {
      if (Meteor.userId() && !_.isEmpty(this.newParty.name) && !_.isEmpty(this.newParty.description)) {
        this.newParty.owner = Meteor.userId();
        if (Meteor.user().username) {
          this.newParty.username = Meteor.user().username;
        } else if (Meteor.user().emails[0]) {
          this.newParty.username = Meteor.user().emails[0].address;
        }
        this.newParty.rsvps = [];
        Parties.insert(this.newParty);
        this.newParty = {};
        // $scope.$close();
        this.$close();
      }
    };
  }
}

const name = 'partyAdd';

//create an angular module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl,
  controllerAs: name,
  controller: PartyAdd
});