angular.module('starter.controllers', [])

.controller('IntroCtrl', ['$scope', '$state', '$ionicPopup', function($scope, $state, $ionicPopup) {
    $scope.step2 = {};
    $scope.step3 = {};

    $scope.start = function() {
        $state.go('tab.dash');
    };

    $scope.startCondition = function() {
        return angular.isDefined($scope.step3.something);
    };

    $scope.$on('wizard:StepFailed', function(e, args) {
        if (args.index == 1) {
          if (args.direction === "next") {
            $ionicPopup.alert({
                title: 'Empty field',
                template: 'Please enter a value!'
            }).then(function (res) {
                console.log('Field is empty');
            });            
          }

          if (args.direction === "previous") {
            $ionicPopup.alert({
              title: "Field Filled",
              template: "You've filled the field"
            });
          }

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
