angular.module('socially').directive('partiesList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/parties/parties-list/parties-list.html',
    controllerAs: 'partiesList',
    controller: function($scope, $reactive) {

      $reactive(this).attach($scope);
      this.newParty = {};
      this.perPage = 2;
      this.page = 1;
      this.sort = {
        name: 1
      };
      this.orderProperty = '1';

      this.searchText = '';

      // this.subscribe('parties');

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
            sort: {
              name: 1
            }
          });
        },
        currentUser: () => {
          return Meteor.user();
        },
        partiesCount: () => {
            return Counts.get('numberOfParties');
          }
      });

      this.updateSort = (val) => {
        this.sort = {
          name: parseInt(/*this.orderProperty*/val) //1 or -1
        };
      };

      this.addParty = () => {
        console.log('>> userId: ' + Meteor.userId());
        if (Meteor.userId() && !_.isEmpty(this.newParty.name) && !_.isEmpty(this.newParty.description)) {
          this.newParty.owner = Meteor.user()._id;
          if (Meteor.user().username) {
            this.newParty.username = Meteor.user().username;
          } else if (Meteor.user().emails[0]) {
            this.newParty.username = Meteor.user().emails[0].address;
          }
          Parties.insert(this.newParty);
          this.newParty = {};
        }
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
