angular.module('socially').directive('partyDetails', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/parties/party-details/party-details.html',
    controllerAs: 'partyDetails',
    controller: function($scope, $stateParams, $reactive, $state) {
      $reactive(this).attach($scope);

      this.subscribe('users');
      this.subscribe('parties');

      this.helpers({
        party: () => {
          return Parties.findOne({
            _id: $stateParams.partyId
          });
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

      this.map = {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: 8,
        events: {
          click: (mapModel, eventName, originalEventArgs) => {
            if (!this.party || !this.isLoggedIn || (this.party.owner !== this.currentUserId)) {
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
              if (!this.party.location) {
                this.party.location = {};
              }
              this.party.location.latitude = marker.getPosition().lat();
              this.party.location.longitude = marker.getPosition().lng();
            }
          }
        }
      };

      this.save = () => {
        Parties.update({
          _id: $stateParams.partyId
        }, {
          $set: {
            name: this.party.name,
            description: this.party.description,
            'public': this.party.public,
            location: this.party.location
          }
        }, (error, no) => {
          if (error) {
            console.log('Oops, unable to update the party...');
          } else {
            console.log('Done!');
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
      this.canInvite = () => {
        if (!this.party) {
          return false;
        }
        return !this.party.public && this.party.owner === Meteor.userId();
      };
    }
  };
});
