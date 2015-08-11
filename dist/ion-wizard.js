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

                this.checkNextCondition = function(index) {
                    return index > (conditions.length - 1)
                        ? false
                        : conditions[index].next();
                };

                this.checkPreviousCondition = function(index) {
                    return index > (conditions.length - 1)
                        ? false
                        : conditions[index].prev();
                };

            }],
            link: function (scope, element, attrs, controller) {
                var currentIndex = 0;

                $ionicSlideBoxDelegate.enableSlide(false);

                element.css('height', '100%');

                scope.$on("wizard:Previous", function() {
                    if (controller.checkPreviousCondition(currentIndex)) {
                        $ionicSlideBoxDelegate.previous();
                    }
                    else {
                        $rootScope.$broadcast("wizard:StepFailed", {index: currentIndex, direction: "previous"});
                    }
                });
                scope.$on("wizard:Next", function() {

                    if (controller.checkNextCondition(currentIndex)) {
                        $ionicSlideBoxDelegate.next();
                    }
                    else {
                         $rootScope.$broadcast("wizard:StepFailed", {index: currentIndex, direction: "next"});
                    }
                });

                scope.$watch(function() {
                    return controller.checkNextCondition(currentIndex) && controller.checkPreviousCondition(currentIndex);
                }, function() {
                    $rootScope.$broadcast("wizard:NextCondition", controller.checkNextCondition(currentIndex));
                    $rootScope.$broadcast("wizard:PreviousCondition", controller.checkPreviousCondition(currentIndex));                    
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
                    return angular.isUndefined(attrs.nextCondition)
                        ? true
                        : scope.nextConditionFn();
                };

                var prevFn = function() {
                    return angular.isUndefined(attrs.prevCondition)
                        ? true
                        : scope.prevConditionFn();
                };

                var conditions = {
                    next: nextFn,
                    prev: prevFn
                };

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
                
                scope.$on("wizard:PreviousCondition", function(e, condition) {
                    element.attr("disabled", !condition);
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
                    element.addClass("ng-disabled");
                    element.toggleClass('ng-hide', index == $ionicSlideBoxDelegate.slidesCount() - 1);
                });

                scope.$on("wizard:NextCondition", function(e, condition) {
                    element.attr("disabled", !condition); 
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