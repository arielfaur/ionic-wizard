angular.module('starter.controllers', [])

.controller('IntroCtrl', ['$scope', '$state', '$localStorage', function($scope, $state, $localStorage) {
    // here we store wizard data
    $scope.step2 = {};
    $scope.step3 = {};

    function persistWizardData() {
        // set flag to indicate wizard has been run
        $localStorage.myAppRun = true;

        // save additional data
        $localStorage.myAppData = {
            something: $scope.wizard.something,
            someOtherData: 'test data'
            };
    }

    $scope.startCondition = function() {
        return angular.isDefined($scope.step3.something);
    };

    $scope.start = function() {
        // save whatever data we need and then redirect to main app
        persistWizardData();

        $state.go('tab.dash');
    };

}])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
