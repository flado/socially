angular.module('socially').directive('partiesList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/parties/parties-list/parties-list.html',
    controllerAs: 'partiesList',
    controller: function($scope, $reactive, $modal) {

      $reactive(this).attach($scope);
      this.newParty = {};
      this.perPage = 10;
      this.page = 1;
      this.sort = {
        name: 1
      };
      this.orderProperty = '1';

      this.searchText = '';

      this.map = {
        center: {
          latitude: 45,
          longitude: -73
        },
        options: {
          maxZoom: 10,
          styles: [{
            'featureType': 'administrative',
            'elementType': 'labels.text.fill',
            'stylers': [{
              'color': '#444444'
            }]
          }, {
            'featureType': 'landscape',
            'elementType': 'all',
            'stylers': [{
              'color': '#f2f2f2'
            }]
          }, {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': [{
              'visibility': 'off'
            }]
          }, {
            'featureType': 'road',
            'elementType': 'all',
            'stylers': [{
              'saturation': -100
            }, {
              'lightness': 45
            }]
          }, {
            'featureType': 'road.highway',
            'elementType': 'all',
            'stylers': [{
              'visibility': 'simplified'
            }]
          }, {
            'featureType': 'road.arterial',
            'elementType': 'labels.icon',
            'stylers': [{
              'visibility': 'off'
            }]
          }, {
            'featureType': 'transit',
            'elementType': 'all',
            'stylers': [{
              'visibility': 'off'
            }]
          }, {
            'featureType': 'water',
            'elementType': 'all',
            'stylers': [{
              'color': '#46bcec'
            }, {
              'visibility': 'on'
            }]
          }]
        },
        zoom: 8
      };
      this.subscribe('users');

      this.subscribe('parties', () => {
        return [{
          limit: parseInt(this.perPage),
          skip: parseInt((this.getReactively('page') - 1) * this.perPage),
          sort: this.getReactively('sort')
        }, this.getReactively('searchText')];
      });

      this.helpers({
        parties: () => {
          return Parties.find({}, {
            sort: this.getReactively('sort')
          });
        },
        users: () => {
          return Meteor.users.find({});
        },
        currentUserId: () => {
          return Meteor.userId();
        },
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        },
        partiesCount: () => {
          return Counts.get('numberOfParties');
        }
      });

      this.updateSort = (val) => {
        let orderValue = val ? parseInt(val) : parseInt(this.orderProperty);
        this.sort = {
          name: orderValue
        };
      };

      this.getPartyCreator = function(party) {
        if (!party) {
          return '';
        }

        let owner = Meteor.users.findOne(party.owner);

        if (!owner) {
          return 'nobody';
        }

        if (Meteor.userId() !== null && owner._id === Meteor.userId()) {
          return 'me';
        }

        return owner;
      };

      this.getUserById = (userId) => {
        return Meteor.users.findOne(userId);
      };

      this.rsvpIndex = (party) => {
        return _.indexOf(_.pluck(party.rsvps, 'user'), Meteor.userId());
      };

      this.openAddNewPartyModal = function() {
        $modal.open({
          animation: true,
          template: '<add-new-party-modal></add-new-party-modal>'
        });
      };

      this.isRSVP = (rsvp, party) => {
        if (Meteor.userId() === null) {
          return false;
        }

        let rsvpIndex = party.myRsvpIndex;
        rsvpIndex = rsvpIndex || _.indexOf(_.pluck(party.rsvps, 'user'), Meteor.userId());

        if (rsvpIndex !== -1) {
          party.myRsvpIndex = rsvpIndex;
          return party.rsvps[rsvpIndex].rsvp === rsvp;
        }
      }

      this.rsvp = (partyId, rsvp) => {
        Meteor.call('rsvp', partyId, rsvp, (error) => {
          if (error) {
            console.log('Oops, unable to rsvp!');
          } else {
            console.log('RSVP Done!');
          }
        });
      };

      this.outstandingInvitations = (party) => {
        return _.filter(this.users, (user) => {
          return (_.contains(party.invited, user._id) && !_.findWhere(party.rsvps, {
            user: user._id
          }));
        });
      };

      this.pageChanged = (newPage) => {
        this.page = newPage;
      };

      this.removeParty = (party) => {
        Parties.remove({
          _id: party._id
        });
      };
    }
  };
});
