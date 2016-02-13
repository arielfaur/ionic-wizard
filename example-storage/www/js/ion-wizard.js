/*
Ionic Wizard v2.0.1

2016-02-13
Updated to work with Ionic 1.2
*/
angular.module('ionic.wizard', [])
    .directive('ionWizard', ['$rootScope', '$timeout', function($rootScope, $timeout) {
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

                scope.swiperOptions = angular.extend(scope.swiperOptions || {}, {
                    initialSlide: 0,
                    autoHeight: true,
                    onInit: function(swiper){
                        scope.swiper = swiper;        
                    }
                });

                scope.$on("wizard:Previous", function() {
                    scope.swiper.slidePrev(true);
                });
                scope.$on("wizard:Next", function() {
                    scope.swiper.slideNext(true);
                });

                scope.$watch('swiper', function(swiper) {
                    if (!swiper) return;

                    swiper.on('onTransitionStart', function(e){
                        $timeout(function() {
                            currentIndex = e.activeIndex;
                        });
                        $rootScope.$broadcast("wizard:IndexChanged", e.activeIndex, swiper.slides.length);
                    });

                     // watch the current index's condition for changes and broadcast the new condition state on change
                    scope.$watch(function() {
                        return controller.checkNextCondition(currentIndex) && controller.checkPreviousCondition(currentIndex);
                    }, function() {
                        if (!scope.swiper) return;

                        var allowNext = controller.checkNextCondition(currentIndex),
                            allowPrev = controller.checkPreviousCondition(currentIndex);

                        if (allowNext) 
                            scope.swiper.unlockSwipeToNext() 
                        else 
                            scope.swiper.lockSwipeToNext();
                        if (allowPrev) 
                            scope.swiper.unlockSwipeToPrev() 
                        else 
                            scope.swiper.lockSwipeToPrev();

                        $rootScope.$broadcast("wizard:NextCondition", allowNext);
                        $rootScope.$broadcast("wizard:PreviousCondition", allowPrev);                    
                    });
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
                    // if there's no condition, just set the condition to true, otherwise evaluate
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
    .directive('ionWizardPrevious', ['$rootScope', function($rootScope) {
        return{
            restrict: 'EA',
            scope: {},
            link: function(scope, element, attrs, controller) {
                element.addClass('ng-hide');

                element.on('click', function() {
                    $rootScope.$broadcast("wizard:Previous");
                });

                scope.$on("wizard:IndexChanged", function(e, index) {
                    element.toggleClass('ng-hide', index == 0);
                });
                
                scope.$on("wizard:PreviousCondition", function(e, condition) {
                    element.attr("disabled", !condition);
                });
            }
        }
    }])
    .directive('ionWizardNext', ['$rootScope', function($rootScope) {
        return{
            restrict: 'EA',
            scope: {},
            link: function(scope, element, attrs, controller) {
                element.on('click', function() {
                    $rootScope.$broadcast("wizard:Next");
                });

                scope.$on("wizard:IndexChanged", function(e, index, count) {
                    element.toggleClass('ng-hide', index == count - 1);
                });

                scope.$on("wizard:NextCondition", function(e, condition) {
                    element.attr("disabled", !condition); 
                });
            }
        }
    }])
    .directive('ionWizardStart', [function() {
        return{
            restrict: 'EA',
            scope: {
                startFn: '&ionWizardStart',
                startCondition: '&condition'
            },
            link: function(scope, element, attrs) {
                element.addClass('ng-hide');

                function checkCondition() {
                    return (angular.isUndefined(attrs.condition)) ? true : scope.startCondition();
                }

                element.on('click', function() {
                    scope.startFn();
                });

                scope.$watch(function() {
                    return checkCondition()
                }, function(result) {
                    element.attr('disabled', !result);
                });

                scope.$on("wizard:IndexChanged", function(e, index, count) {
                    element.toggleClass('ng-hide', index < count - 1);
                });
            }
        }
    }]);
