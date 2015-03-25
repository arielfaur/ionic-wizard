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

        spyOn($rootScope, '$broadcast').andCallThrough();
    }));

    describe('Test wizard next button', function() {
        var element, wrappedElement, $ionicSlideBoxDelegate;

        beforeEach(inject(function(_$ionicSlideBoxDelegate_) {

            $ionicSlideBoxDelegate = _$ionicSlideBoxDelegate_;

            element = "<button ion-wizard-next>Move next</button>";
            wrappedElement = angular.element(element);
        }));

        it('Broadcasts next event on click', function() {
            // Compile a piece of HTML containing the directive
            element = $compile("<button ion-wizard-next>Move next</button>")(scope);

            element.triggerHandler('click');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:Next");
        });


        it('Hides next button when reaching the last wizard step', function() {

            spyOn($ionicSlideBoxDelegate, 'currentIndex').andReturn(2);
            spyOn($ionicSlideBoxDelegate, 'slidesCount').andReturn(3);

            // Compile a piece of HTML containing the directive
            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('wizard:IndexChanged');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:IndexChanged");

            expect(wrappedElement.hasClass('ng-hide')).toBeTruthy();
        });

        it('Does not hide next button if not the end of wizard', function() {
            spyOn($ionicSlideBoxDelegate, 'currentIndex').andReturn(1);
            spyOn($ionicSlideBoxDelegate, 'slidesCount').andReturn(13);

            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('wizard:IndexChanged');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:IndexChanged");

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

        it('Broadcasts next event on click', function() {
            // Compile a piece of HTML containing the directive
            var el = $compile(element)(scope);

            el.triggerHandler('click');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:Previous");
        });


        it('Hides previous button on first step', function() {
            spyOn($ionicSlideBoxDelegate, 'currentIndex').andReturn(0);

            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('wizard:IndexChanged');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:IndexChanged");

            expect(wrappedElement.hasClass('ng-hide')).toBeTruthy();
        });

        it('Does not hide previous button on other steps', function() {
            spyOn($ionicSlideBoxDelegate, 'currentIndex').andReturn(2);

            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('wizard:IndexChanged');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:IndexChanged");

            expect(wrappedElement.hasClass('ng-hide')).toBeFalsy();
        });

    });


    describe('Test wizard directive', function() {
        var element, controller, $ionicSlideBoxDelegate;

        beforeEach(inject(function(_$ionicSlideBoxDelegate_) {
            $ionicSlideBoxDelegate = _$ionicSlideBoxDelegate_;

            element = angular.element("<div ion-wizard><div ion-wizard-step condition=''>Move next</div><div ion-wizard-step condition='conditionStep2()'>Move next</div><div ion-wizard-step condition='conditionStep3()'>Move next</div></div>");
            $compile(element)(scope);
            scope.$digest();
            controller = element.controller('ionWizard');
        }));

        it('Should pass when condition undefined on button click', function() {
            spyOn($ionicSlideBoxDelegate, 'currentIndex').andReturn(0);
            spyOn(controller, 'isStepValid').andReturn(true);
            $rootScope.$broadcast('wizard:Next');

            expect(controller.isStepValid).toHaveBeenCalledWith(0);
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:IndexChanged");
        });

        it('Should pass when condition is defined and truthy on button click', function() {
            spyOn($ionicSlideBoxDelegate, 'currentIndex').andReturn(1);
            spyOn(controller, 'isStepValid').andReturn(111);
            $rootScope.$broadcast('wizard:Next');

            expect(controller.isStepValid).toHaveBeenCalledWith(1);
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:IndexChanged");
        });

        it('Should not pass when condition is defined and falsy on button click', function() {
            spyOn($ionicSlideBoxDelegate, 'currentIndex').andReturn(2);
            spyOn(controller, 'isStepValid').andReturn(false);
            $rootScope.$broadcast('wizard:Next');

            expect(controller.isStepValid).toHaveBeenCalledWith(2);
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:StepFailed", {index: 2});
        });
    });

    describe('Test wizard start button', function() {
        var element, wrappedElement, $ionicSlideBoxDelegate;

        beforeEach(inject(function (_$ionicSlideBoxDelegate_) {

            $ionicSlideBoxDelegate = _$ionicSlideBoxDelegate_;

            element = "<button ion-wizard-start>Start the app</button>";
            wrappedElement = angular.element(element);
        }));

        it('Hides button on any step but the last one', function () {
            spyOn($ionicSlideBoxDelegate, 'currentIndex').andReturn(5);
            spyOn($ionicSlideBoxDelegate, 'slidesCount').andReturn(13);

            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('wizard:IndexChanged');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:IndexChanged");

            expect(wrappedElement.hasClass('ng-hide')).toBeTruthy();
        });

        it('Shows button on the last step', function () {
            spyOn($ionicSlideBoxDelegate, 'currentIndex').andReturn(12);
            spyOn($ionicSlideBoxDelegate, 'slidesCount').andReturn(13);

            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('wizard:IndexChanged');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:IndexChanged");

            expect(wrappedElement.hasClass('ng-hide')).toBeFalsy();
        });
    });
});