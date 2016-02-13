angular.module('starter.controllers', [])

.controller('IntroCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.step1 = {};
    $scope.step2 = {};
    $scope.step3 = {};

    $scope.start = function() {
        $state.go('tab.dash');
    };

    $scope.startCondition = function() {
        return angular.isDefined($scope.step3.something);
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
