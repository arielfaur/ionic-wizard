angular.module('ionic.wizard', [])

    .directive('ionWizard', ['$rootScope', '$ionicSlideBoxDelegate', function($rootScope, $ionicSlideBoxDelegate) {
        return{
            restrict: 'EA',
            controller: [function() {
                var conditions = [];

                this.addCondition = function(condition) {
                    conditions.push(condition);
                };

                this.isStepValid = function(index) {
                    return angular.isDefined(conditions[index]) ? conditions[index]() : true;
                };

            }],
            link: function (scope, element, attrs, controller) {
                element.css('height', '100%');

                scope.$on("wizard:Previous", function() {
                    $ionicSlideBoxDelegate.previous();
                    $rootScope.$broadcast("wizard:IndexChanged");
                });
                scope.$on("wizard:Next", function() {
                    var index = $ionicSlideBoxDelegate.currentIndex();

                    if (controller.isStepValid(index)) {
                        $ionicSlideBoxDelegate.next();
                        $rootScope.$broadcast("wizard:IndexChanged");
                    } else {
                        $rootScope.$broadcast("wizard:StepFailed", {index: index});
                    }
                });
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
                    $rootScope.$broadcast("wizard:Previous");
                });

                scope.$on("wizard:IndexChanged", function() {
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

                scope.$on("wizard:IndexChanged", function() {
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

                scope.$on("wizard:IndexChanged", function() {
                    element.toggleClass('ng-hide', $ionicSlideBoxDelegate.currentIndex() < $ionicSlideBoxDelegate.slidesCount() - 1);
                });
            }
        }
    }]);