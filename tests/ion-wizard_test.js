describe('Unit testing wizard directives', function() {
    var $compile,
        $rootScope,
        $controller,
        scope;

    // Load the ionic.wizard module, which contains the directive
    beforeEach(module('ionic'));
    beforeEach(module('ionic.wizard'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_, _$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;

        scope = $rootScope.$new();

        spyOn($rootScope, '$broadcast').and.callThrough();
    }));

    describe('Test wizard next button', function() {
        var element, wrappedElement, $ionicSlideBoxDelegate;

        beforeEach(inject(function(_$ionicSlideBoxDelegate_) {

            $ionicSlideBoxDelegate = _$ionicSlideBoxDelegate_;

            element = "<button ion-wizard-next>Move next</button>";
            wrappedElement = angular.element(element);
        }));

        it('Should broadcast next event on click', function() {
            // Compile a piece of HTML containing the directive
            element = $compile("<button ion-wizard-next>Move next</button>")(scope);

            element.triggerHandler('click');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:Next");
        });


        it('Should hide next button when reaching the last wizard step', function() {

            spyOn($ionicSlideBoxDelegate, 'slidesCount').and.returnValue(3);

            // Compile a piece of HTML containing the directive
            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('slideBox.slideChanged', 2);

            expect(wrappedElement.hasClass('ng-hide')).toBeTruthy();
        });

        it('Should display next button if not the end of wizard', function() {
            spyOn($ionicSlideBoxDelegate, 'slidesCount').and.returnValue(13);

            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('slideBox.slideChanged', 1);

            expect(wrappedElement.hasClass('ng-hide')).toBeFalsy();
        });

    });

    describe('Test wizard previous button', function() {
        var element, wrappedElement, $ionicSlideBoxDelegate;

        beforeEach(inject(function(_$ionicSlideBoxDelegate_) {

            $ionicSlideBoxDelegate = _$ionicSlideBoxDelegate_;

            element = "<button ion-wizard-previous>Move Previous</button>";
            wrappedElement = angular.element(element);
        }));

        it('Should broadcast next event on click', function() {
            // Compile a piece of HTML containing the directive
            var el = $compile(element)(scope);

            el.triggerHandler('click');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:Previous");
        });


        it('Should hide previous button on first step', function() {
            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('slideBox.slideChanged', 0);

            expect(wrappedElement.hasClass('ng-hide')).toBeTruthy();
        });

        it('Should display previous button on every other step', function() {
            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('slideBox.slideChanged', 5);

            expect(wrappedElement.hasClass('ng-hide')).toBeFalsy();
        });

    });


    describe('Test wizard directive', function() {
        var element, controller, $ionicSlideBoxDelegate, nextButtonElement, prevButtonElement;

        var injectDirectives = function injectDirectives(condition) {
            inject(function(_$ionicSlideBoxDelegate_) {

                if (condition === undefined) {
                    // no conditions
                    element = angular.element("<div ion-wizard><div ion-wizard-step >Move next</div> \
                        <div ion-wizard-step >Move next</div> \
                        </div>"
                    );

                }
                else {
                    scope.nextConditionFn = function() {
                        return condition;
                    };

                    scope.prevConditionFn = function() {
                        return condition;
                    };

                    element = angular.element("<div ion-wizard><div ion-wizard-step next-condition='nextConditionFn()' prev-condition='prevConditionFn()'>Move next</div> \
                        <div ion-wizard-step >Move next</div> \
                        </div>"
                    );
                }
                prevButtonElement = angular.element("<button ion-wizard-previous>Previous</button>");
                nextButtonElement = angular.element("<button ion-wizard-next>Next</button>");    
          
                $compile(element)(scope);
                $compile(prevButtonElement)(scope);
                $compile(nextButtonElement)(scope);
                scope.$digest();
                controller = element.controller('ionWizard');

            });
        }

        describe("next-condition", function() {
            describe("for an undefined condition", function() {
                beforeEach(function() {
                    injectDirectives(undefined);
                });

                it("should pass", function() {
                    var condition = controller.checkNextCondition(0);
                    expect(condition).toBeTruthy();
                });

                it("should enable the next button", function() {
                    var buttonDisabled = nextButtonElement.attr("disabled");
                    expect(buttonDisabled).toBeFalsy();
                });
            });

            describe("for a true condition", function() {
                beforeEach(function() {
                    injectDirectives(true);
                });

                it("should pass", function() {
                    var condition = controller.checkNextCondition(0);
                    expect(condition).toBeTruthy();
                });

                it("should enable the next button", function() {
                    var buttonDisabled = nextButtonElement.attr("disabled");
                    expect(buttonDisabled).toBeFalsy();
                });
            });

            describe("for a false condition", function() {
                beforeEach(function() {
                    injectDirectives(false);
                });

                it("should fail", function() {
                    var condition = controller.checkNextCondition(0);
                    expect(condition).toBeFalsy();
                });

                it("should disable the next button", function() {
                    var buttonDisabled = nextButtonElement.attr("disabled");
                    expect(buttonDisabled).toBeTruthy();
                });
            });
        });
        describe("prev-condition", function() {
            describe("for an undefined condition", function() {
                beforeEach(function() {
                    injectDirectives(undefined);
                });

                it("should pass", function() {
                    var condition = controller.checkPreviousCondition(0);
                    expect(condition).toBeTruthy();
                });

                it("should enable the next button", function() {
                    var buttonDisabled = prevButtonElement.attr("disabled");
                    expect(buttonDisabled).toBeFalsy();
                });
            });

            describe("for a true condition", function() {
                beforeEach(function() {
                    injectDirectives(true);
                });

                it("should pass", function() {
                    var condition = controller.checkPreviousCondition(0);
                    expect(condition).toBeTruthy();
                });

                it("should enable the next button", function() {
                    var buttonDisabled = prevButtonElement.attr("disabled");
                    expect(buttonDisabled).toBeFalsy();
                });
            });

            describe("for a false condition", function() {
                beforeEach(function() {
                    injectDirectives(false);
                });

                it("should fail", function() {
                    var condition = controller.checkPreviousCondition(0);
                    expect(condition).toBeFalsy();                    
                });

                it("should disable the next button", function() {
                    var buttonDisabled = prevButtonElement.attr("disabled");
                    expect(buttonDisabled).toBeTruthy();
                });
            });

        });
    });

    describe('Test wizard start button', function() {
        var element, wrappedElement, $ionicSlideBoxDelegate;

        beforeEach(inject(function (_$ionicSlideBoxDelegate_) {

            $ionicSlideBoxDelegate = _$ionicSlideBoxDelegate_;

            element = "<button ion-wizard-start>Start the app</button>";
            wrappedElement = angular.element(element);
        }));

        it('Should hide start button on any step but the last one', function () {
            spyOn($ionicSlideBoxDelegate, 'slidesCount').and.returnValue(13);

            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('slideBox.slideChanged', 5);

            expect(wrappedElement.hasClass('ng-hide')).toBeTruthy();
        });

        it('Should display start button on the last step', function () {
            spyOn($ionicSlideBoxDelegate, 'slidesCount').and.returnValue(13);

            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('slideBox.slideChanged', 12);

            expect(wrappedElement.hasClass('ng-hide')).toBeFalsy();
        });

        describe('Test start condition', function() {

            beforeEach(function() {
                scope.onStart_Pass_Condition = function() {
                    return true;
                };

                scope.onStart_Fail_Condition = function() {
                    return false;
                };

                scope.startFn = function() {
                    console.log('Launch app');
                };

                spyOn(scope, 'startFn');
                spyOn(scope, 'onStart_Fail_Condition').and.callThrough();
                spyOn(scope, 'onStart_Pass_Condition').and.callThrough();
            });


            it('Should fail to launch app with falsy condition', function() {
                element = "<button ion-wizard-start='startFn()' condition='onStart_Fail_Condition()'>Start the app</button>";
                wrappedElement = angular.element(element);

                $compile(wrappedElement)(scope);
                scope.$digest();
                expect(wrappedElement.attr('disabled')).toBeTruthy();
            });

            it('Should launch app with passing condition', function() {
                element = "<button ion-wizard-start='startFn()' condition='onStart_Pass_Condition()'>Start the app</button>";
                wrappedElement = angular.element(element);

                $compile(wrappedElement)(scope);
                scope.$digest();
                expect(wrappedElement.attr('disabled')).toBeFalsy();
            });

            it('Should launch app if no condition defined', function() {
                element = "<button ion-wizard-start='startFn()'>Start the app</button>";
                wrappedElement = angular.element(element);

                $compile(wrappedElement)(scope);
                scope.$digest();
                expect(wrappedElement.attr('disabled')).toBeFalsy();
            });
        });


    });
});