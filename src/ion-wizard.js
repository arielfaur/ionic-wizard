angular.module('ionic.wizard', [])

    .directive('ionWizard', ['$compile', '$rootScope', function($compile, $rootScope) {
        return{
            restrict: 'EA',
            //scope: {},    // shared scope so we can evaluate expressions from parent scopes
            controller: ['$scope', '$ionicSlideBoxDelegate', function($scope, $ionicSlideBoxDelegate) {
                var totalSteps, activeIndex = 0;

                $scope.conditions = [];

                //$ionicSlideBoxDelegate.enableSlide(false);
                $scope.getActiveStep = function() {
                    return activeIndex + 1;
                };

                // Called each time the slide changes
                $scope.slideChanged = function(index) {
                    if (!totalSteps) {
                        totalSteps = $ionicSlideBoxDelegate.slidesCount();
                    }
                    activeIndex = index;
                    $rootScope.$broadcast("wizard:Index", { current: index, total: totalSteps});
                };

                $scope.$on("wizard:Previous", function() {
                    $ionicSlideBoxDelegate.previous();
                });
                $scope.$on("wizard:Next", function() {
                    var isStepValid = $scope.conditions[activeIndex] ? $scope.$eval($scope.conditions[activeIndex]) : true;
                    if (isStepValid)
                        $ionicSlideBoxDelegate.next();
                });
            }],
            terminal: true,
            priority: 1000,
            link: function (scope, element, attrs, controller) {
                /*
                 http://stackoverflow.com/questions/19224028/add-directives-from-directive-in-angularjs?rq=1
                 * */
                element.attr('on-slide-changed', 'slideChanged(index)');
                element.removeAttr('wizard');
                $compile(element)(scope);
            }
        }

    }])
    .directive('ionWizardStep', [function() {
        return {
            restrict: 'EA',
            //scope: {},
            require: '^wizard',
            link: function(scope, element, attrs, controller) {
                var stepCondition = attrs.wizardStep;
                scope.conditions.push(stepCondition);
            }
        }
    }])
    .directive('ionWizardPrevious', ['$rootScope', function($rootScope) {
        return{
            restrict: 'EA',
            link: function(scope, element, attrs, controller) {

                element.addClass('ng-hide');

                element.on('click', function() {
                    $rootScope.$broadcast("wizard:Previous");
                });

                scope.$on("wizard:Index", function(e, slides) {
                    //scope.index = slides.current;
                    element.toggleClass('ng-hide', slides.current == 0);
                });
            }
        }
    }])
    .directive('ionWizardNext', ['$rootScope', function($rootScope) {
        return{
            restrict: 'EA',
            link: function(scope, element, attrs, controller) {
                element.on('click', function() {
                    $rootScope.$broadcast("wizard:Next");
                });

                scope.$on("wizard:Index", function(e, slides) {
                    element.toggleClass('ng-hide', slides.current == slides.total - 1);
                });
            }
        }
    }]);