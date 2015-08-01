angular.module('ionic.wizard', [])
    .directive('ionWizardContent', ['ionContentDirective', function(ionContentDirective) {
      return angular.extend({}, ionContentDirective[0], { scope: false });
    }])
    .directive('ionWizard', ['$rootScope', '$ionicSlideBoxDelegate', function($rootScope, $ionicSlideBoxDelegate) {
        return{
            restrict: 'EA',
            controller: [function() {
                var conditions = [];

                this.addCondition = function(condition) {
                    conditions.push(condition);
                };

                this.getCondition = function(index) {
                    return conditions[index];
                };

            }],
            link: function (scope, element, attrs, controller) {
                var currentIndex = 0;

                $ionicSlideBoxDelegate.enableSlide(false);

                element.css('height', '100%');

                scope.$on("wizard:Previous", function() {
                    var fn = controller.getCondition(currentIndex);

                    fn.prev().then(function () {
                        $ionicSlideBoxDelegate.previous();
                    }, function () {
                        $rootScope.$broadcast("wizard:StepFailed", {index: currentIndex, direction: "previous"});
                    });
                });
                scope.$on("wizard:Next", function() {
                    var fn = controller.getCondition(currentIndex);
                    fn.next().then(function () {
                        $ionicSlideBoxDelegate.next();
                    }, function () {
                        $rootScope.$broadcast("wizard:StepFailed", {index: currentIndex, direction: "next"});
                    })
                });

                scope.$on("slideBox.slideChanged", function(e, index) {
                    currentIndex = index;
                });
            }
        }

    }])
    .directive('ionWizardStep', ['$q', function($q) {
        return {
            restrict: 'EA',
            scope: {
                nextConditionFn: '&nextCondition',
                prevConditionFn: "&prevCondition"
            },
            require: '^^ionWizard',
            link: function(scope, element, attrs, controller) {
                var nextFn = function() {
                    var deferred  = $q.defer();

                    if (angular.isUndefined(attrs.nextCondition)) {
                        deferred.resolve();
                    } else {
                        if (scope.nextConditionFn()) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    }

                    return deferred.promise;
                };

                var prevFn = function() {
                    var deferred  = $q.defer();

                    if (angular.isUndefined(attrs.prevCondition)) {
                        deferred.resolve();
                    } else {
                        if (scope.prevConditionFn()) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    }

                    return deferred.promise;
                };

                var conditions = {
                    next: nextFn,
                    prev: prevFn
                }

                controller.addCondition(conditions);
            }
        }
    }])
    .directive('ionWizardPrevious', ['$rootScope', '$ionicSlideBoxDelegate', function($rootScope) {
        return{
            restrict: 'EA',
            scope: {},
            link: function(scope, element, attrs, controller) {

                element.addClass('ng-hide');

                element.on('click', function() {
                    $rootScope.$broadcast("wizard:Previous");
                });

                scope.$on("slideBox.slideChanged", function(e, index) {
                    element.toggleClass('ng-hide', index == 0);
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

                scope.$on("slideBox.slideChanged", function(e, index) {
                    element.toggleClass('ng-hide', index == $ionicSlideBoxDelegate.slidesCount() - 1);
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

                scope.$on("slideBox.slideChanged", function(e, index) {
                    element.toggleClass('ng-hide', index < $ionicSlideBoxDelegate.slidesCount() - 1);
                });
            }
        }
    }]);