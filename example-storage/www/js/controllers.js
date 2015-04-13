angular.module('starter.controllers', [])

.controller('IntroCtrl', ['$scope', '$state', '$ionicPopup', '$localStorage', function($scope, $state, $ionicPopup, $localStorage) {
    // here we store wizard data
    $scope.wizard = {};

    function persistWizardData() {
        // set flag to indicate wizard has been run
        $localStorage.myAppRun = true;

        // save additional data
        $localStorage.myAppData = {
            something: $scope.wizard.something,
            someOtherData: 'test data'
            };
    }

    $scope.start = function() {
        // save whatever data we need and then redirect to main app
        persistWizardData();

        $state.go('tab.dash');
    };

    $scope.$on('wizard:StepFailed', function(e, args) {
        if (args.index == 1) {
            $ionicPopup.alert({
                title: 'Empty field',
                template: 'Please enter a value!'
            }).then(function (res) {
                console.log('Field is empty');
            });
        }
    });

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
