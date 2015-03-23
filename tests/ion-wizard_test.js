describe('Unit testing wizard directives', function() {
    var $compile,
        $rootScope,
        scope;

    // Load the ionic.wizard module, which contains the directive
    beforeEach(module('ionic'));
    beforeEach(module('ionic.wizard'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        scope = $rootScope.$new();

        spyOn($rootScope, '$broadcast').andCallThrough();
    }));

    describe('Test wizard next button', function() {
        var element, wrappedElement;

        beforeEach(function() {
            element = "<button ion-wizard-next>Move next</button>";
            wrappedElement = angular.element(element);
        });

        it('Broadcasts next event on click', function() {
            // Compile a piece of HTML containing the directive
            element = $compile("<button ion-wizard-next>Move next</button>")(scope);

            element.triggerHandler('click');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:Next");
        });


        it('Hides next button when reaching the last wizard step', function() {
            // Compile a piece of HTML containing the directive
            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('wizard:Index', { current: 2, total: 3});
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:Index", { current: 2, total: 3});

            expect(wrappedElement.hasClass('ng-hide')).toBeTruthy();
        });

        it('Does not hide next button if not the end of wizard', function() {
            // Compile a piece of HTML containing the directive
            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('wizard:Index', { current: 1, total: 13});
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:Index", { current: 1, total: 13});

            expect(wrappedElement.hasClass('ng-hide')).toBeFalsy();
        });

    });

    describe('Test wizard previous button', function() {
        var element, wrappedElement;

        beforeEach(function() {
            element = "<button ion-wizard-previous>Move Previous</button>";
            wrappedElement = angular.element(element);
        });

        it('Broadcasts next event on click', function() {
            // Compile a piece of HTML containing the directive
            var el = $compile(element)(scope);

            el.triggerHandler('click');
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:Previous");
        });


        it('Hides previous button on first step', function() {
            // Compile a piece of HTML containing the directive
            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('wizard:Index', { current: 0, total: 3});
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:Index", { current: 0, total: 3});

            expect(wrappedElement.hasClass('ng-hide')).toBeTruthy();
        });

        it('Does not hide previous button on other steps', function() {
            // Compile a piece of HTML containing the directive
            $compile(wrappedElement)(scope);

            $rootScope.$broadcast('wizard:Index', { current: 2, total: 13});
            expect($rootScope.$broadcast).toHaveBeenCalledWith("wizard:Index", { current: 2, total: 13});

            expect(wrappedElement.hasClass('ng-hide')).toBeFalsy();
        });

    });

    /*it('Replaces the element with the appropriate content', function() {
        // Compile a piece of HTML containing the directive
        var element = $compile("<a-great-eye></a-great-eye>")($rootScope);
        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        $rootScope.$digest();
        // Check that the compiled element contains the templated content
        expect(element.html()).toContain("lidless, wreathed in flame, 2 times");
    });*/

    describe('Test wizard step directive', function() {
        var element, wrappedElement, $ionicSlideBoxDelegate, compile;

        beforeEach(inject(function(_$ionicSlideBoxDelegate_){
            //wrappedElement = angular.element(element);
            $ionicSlideBoxDelegate = _$ionicSlideBoxDelegate_;

            scope.conditions = [];

        }));

        it('Adds exactly 2 conditions to parent scope array', function() {
            element = "<div ion-wizard-step=''>Move next</div><div ion-wizard-step='1=1'>Move next</div><div ion-wizard-step='2=2'>Move next</div>";
            $compile(element)(scope);

            expect(scope.conditions).toContain('1=1');
            expect(scope.conditions).toContain('2=2');
            expect(scope.conditions.length).toBe(3);
        })
    })
});