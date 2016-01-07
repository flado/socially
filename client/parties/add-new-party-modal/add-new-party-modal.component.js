angular.module('socially').directive('addNewPartyModal', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/parties/add-new-party-modal/add-new-party-modal.html',
    controllerAs: 'addNewPartyModal',
    controller: function($scope, $stateParams, $reactive) {
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
          $scope.$close();
        }
      };
    }
  };
});
