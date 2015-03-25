angular.module('starter.controllers', [])

.controller('IntroCtrl', ['$scope', '$state', '$ionicPopup', function($scope, $state, $ionicPopup) {
    $scope.start = function() {
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
