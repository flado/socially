import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './partyDetails.html';
import DisplayNameFilter from '../../filters/displayNameFilter';
import UninvitedFilter from '../../filters/uninvitedFilter';
import { Parties } from '../../../api/parties';

class PartyDetails {
  constructor($scope, $stateParams, $reactive, $state) {
    'ngInject';
    $reactive(this).attach($scope);

    this.subscribe('users');
    this.subscribe('parties');

    this.helpers({
      party: () => {
        if ($stateParams.partyId) {
          return Parties.findOne({
            _id: $stateParams.partyId
          });
        }
        return null;
      },
      users: () => {
        return Meteor.users.find({});
      },
      isLoggedIn: () => {
        return Meteor.userId() !== null;
      },
      currentUserId: () => {
        return Meteor.userId();
      }
    });

    this.canInvite = !this.party ? false : (!this.party.public && this.party.owner === this.currentUserId);
    this.canEdit = this.isLoggedIn && this.party && ((this.party.public && !this.party.owner) || (this.party.owner === this.currentUserId));

    this.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8,
      events: {
        click: (mapModel, eventName, originalEventArgs) => {
          // if (!this.party || !this.isLoggedIn || (this.party.owner && (this.party.owner !== this.currentUserId))) {
          if (!this.canEdit) {
            return;
          }

          if (!this.party.location) {
            this.party.location = {};
          }

          this.party.location.latitude = originalEventArgs[0].latLng.lat();
          this.party.location.longitude = originalEventArgs[0].latLng.lng();

          //scope apply required because this event handler is outside of the angular domain
          $scope.$apply();
        }
      },
      marker: {
        options: {
          draggable: true
        },
        events: {
          dragend: (marker, eventName, args) => {
            if (!this.party || !this.isLoggedIn || (this.party.owner !== this.currentUserId)) {
              return;
            }
            if (!this.party.location) {
              this.party.location = {};
            }
            this.party.location.latitude = marker.getPosition().lat();
            this.party.location.longitude = marker.getPosition().lng();
          }
        }
      }
    };

    /*$scope.$watch('partyDetails.party', function(newVal, oldVal){
      console.log('>> party changed => old:', oldVal, ' new: ', newVal);
      if (oldVal && newVal) {
        $scope.partyDetails.dirty = newVal.public !== oldVal.public;
      }
    }, true);*/

    this.save = () => {
      let modifier = {
        $set: {
          name: this.party.name,
          description: this.party.description,
          'public': this.party.public,
          location: this.party.location
        }
      };
      if (!this.party.owner && this.party.public) {
        modifier.$set.owner = this.currentUserId;
        if (Meteor.user().username) {
          modifier.$set.username = Meteor.user().username;
        }
      }
      //update party record
      Parties.update({
        _id: $stateParams.partyId
      }, modifier, (error, no) => {
        if (error) {
          console.log('Oops, unable to update the party...');
        } else {
          console.log('Done!');
          this.dirty = false;
          if (no === 1) {
            $state.go('parties');
          }
        }
      });
    };

    this.invite = (user) => {
      Meteor.call('invite', this.party._id, user._id, (error) => {
        if (error) {
          console.log('Oops, unable to invite!');
        } else {
          console.log('Invited: ', user);
        }
      });
    };
  }
}

const name = 'partyDetails';

//create an angular module
export default angular.module(name, [
    angularMeteor,
    DisplayNameFilter.name,
    UninvitedFilter.name
  ])
  .component(name, {
    templateUrl,
    controllerAs: name,
    controller: PartyDetails
  })
  .config(config);



function config($stateProvider) {
  'ngInject';

  $stateProvider.state('partyDetails', {
    url: '/parties/:partyId',
    template: '<party-details></party-details>'
      /*,
            resolve: {
              currentUser: ($q) => {
                if (Meteor.userId() === null) {
                  return $q.reject('AUTH_REQUIRED');
                } else {
                  return $q.resolve();
                }
              }
            }*/
  });

  /*$stateProvider.state('partyDetails', {
    url: '/parties/:partyId',
    template: '<party-details [party-id]="partyDetailsRoute.partyId"></party-details>',
    controllerAs: 'partyDetailsRoute',
    controller: function($stateParams, $scope) {
      'ngInject';
      this.partyId = $stateParams.partyId;
    },
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  });*/
}