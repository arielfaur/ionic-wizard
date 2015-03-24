angular.module('ionic.wizard', [])

    .directive('ionWizard', ['$rootScope', function($rootScope) {
        return{
            restrict: 'EA',
            //scope: {},    // shared scope so we can evaluate expressions from parent scopes
            controller: ['$scope', '$ionicSlideBoxDelegate', function($scope, $ionicSlideBoxDelegate) {

                var conditions = [];

                this.addCondition = function(condition) {
                    conditions.push(condition);
                };

                $scope.$on("wizard:Previous", function() {
                    $ionicSlideBoxDelegate.previous();
                    $rootScope.$broadcast("wizard:Index");
                });
                $scope.$on("wizard:Next", function() {
                    var index = $ionicSlideBoxDelegate.currentIndex();

                    var isStepValid = angular.isDefined(conditions[index]) ? conditions[index]() : true;
                    if (isStepValid) {
                        $ionicSlideBoxDelegate.next();
                        $rootScope.$broadcast("wizard:Index");
                    }
                });
            }],
            link: function (scope, element, attrs, controller) {
                element.css('height', '100%');

            }
        }

    }])
    .directive('ionWizardStep', [function() {
        return {
            restrict: 'EA',
            scope: {
                conditionFn: '&condition'
            },
            require: '^^ionWizard',
            link: function(scope, element, attrs, controller) {
                controller.addCondition(attrs.condition ? scope.conditionFn : undefined);
            }
        }
    }])
    .directive('ionWizardPrevious', ['$rootScope', '$ionicSlideBoxDelegate', function($rootScope, $ionicSlideBoxDelegate) {
        return{
            restrict: 'EA',
            scope: {},
            link: function(scope, element, attrs, controller) {

                element.addClass('ng-hide');

                element.on('click', function() {
                    //$ionicSlideBoxDelegate.previous();
                    $rootScope.$broadcast("wizard:Previous");
                });

                scope.$on("wizard:Index", function() {
                    element.toggleClass('ng-hide', $ionicSlideBoxDelegate.currentIndex() == 0);
                });
            }
        }
    }])
    .directive('ionWizardNext', ['$rootScope', '$ionicSlideBoxDelegate', function($rootScope, $ionicSlideBoxDelegate) {
        return{
            restrict: 'EA',
            scope: {},
            link: function(scope, element, attrs, controller) {
                element.on('click', function() {
                    $rootScope.$broadcast("wizard:Next");
                });

                scope.$on("wizard:Index", function() {
                    element.toggleClass('ng-hide', $ionicSlideBoxDelegate.currentIndex() == $ionicSlideBoxDelegate.slidesCount() - 1);
                });
            }
        }
    }])
    .directive('ionWizardStart', ['$ionicSlideBoxDelegate', function($ionicSlideBoxDelegate) {
        return{
            restrict: 'EA',
            scope: {
                startFn: '&ionWizardStart'
            },
            link: function(scope, element) {
                element.addClass('ng-hide');

                element.on('click', function() {
                    scope.startFn();
                });

                scope.$on("wizard:Index", function() {
                    element.toggleClass('ng-hide', $ionicSlideBoxDelegate.currentIndex() < $ionicSlideBoxDelegate.slidesCount() - 1);
                });
            }
        }
    }]);