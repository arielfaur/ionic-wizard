# ionic-wizard

A set of Angular directives to create a startup wizard component using Ionic's ion-slide-box

[Demo] (http://run.plnkr.co/plunks/E6fpAnDtsxPAhhSCrNZ4/)

## Sample Projects

There are two sample Ionic projects included. They may be run locally with `ionic serve`

### example

A simple wizard as shown in the demo above, run each time the app is launched.

### example-storage
 
A first time wizard with localStorage integration, runs only once and saves some settings in the localStorage.

## Getting Started

```
bower install ionic-wizard
```

## Add JS file
```
<script src="dist/ion-wizard.js"></script>
```

## Add dependencies
```
angular.module('myApp', ['ionic', 'ionic.wizard'])
```

## Create your wizard template and add wizard directives

###ion-wizard-previous
Add this directive to any link or button to add back behavior. Back button will be hidden on the first step of the wizard.

```
<button class="button button-light no-animation" ion-wizard-previous>Back</button>
```

###ion-wizard-next
Add this directive to any link or button to add next behavior. Next button will be hidden on the last step of the wizard.

```
<button class="button button-light no-animation" ion-wizard-next>Next</button>
```

###ion-wizard-start
Use this directive to attach a callback to the start button to launch the app. The button will be shown only
in the last step of the wizard.

```
<button class="button button-light no-animation" ion-wizard-start="start()">Start App</button>
```

###ion-wizard
Main wizard directive must be added to Ionic's ion-slide-box directive

```
<ion-slide-box ion-wizard>
    ...
</ion-slide-box>
```

###ion-wizard-step
Apply this directive to an `ion-slide` to define each step of the wizard. If needed, a condition can be defined which
will be evaluated before allowing the user to move forward. An event is generated if the condition fails
that can be used to inform the user or perform any other action from the controller.
Apply the `has-header` class to add some top padding in case there is a navigation bar.

```
<ion-slide ion-wizard-step condition="user.LastName != undefined" class="has-header">
    ...
</ion-slide>
```

Then in your app controller:

```
angular.module('myApp.controllers')
    .controller('IntroCtrl', ['$scope', '$ionicPopup', function($scope, $ionicPopup) {
        $scope.$on('wizard:StepFailed', function(e, args) {
            if (args.index == 1) {
                $ionicPopup.alert({
                    title: 'Empty field',
                    template: 'Please enter a value!'
                }).then(function (res) {
                    console.log('Field is empty');
                });
            }
        });
    }]);
```

###ion-wizard-content
To make the content scrollable within a particular slide wrap the content in a `ion-wizard-content` directive.
If there is a navigation bar apply the `has-header` class to this directive instead of the outer `ion-slide-box`.

```
<ion-slide-box ion-wizard>
        <ion-slide ion-wizard-step>
            <ion-wizard-content class="has-header">
                <div class="row">
                   ...
                </div>
            </ion-wizard-content>
        </ion-slide>
</ion-slide-box>
```

##Sample view with a wizard definition

```
    <ion-view>
        <ion-nav-buttons side="left">
            <button class="button button-light no-animation" ng-click="start()">
                Skip wizard
            </button>
            <button class="button button-light no-animation" ion-wizard-previous>
                Back
            </button>
        </ion-nav-buttons>
        <ion-nav-buttons side="right">
            <button class="button button-light no-animation" ion-wizard-next>
                Next
            </button>
            <button class="button button-light no-animation" ion-wizard-start="start()">
                Start App
            </button>
        </ion-nav-buttons>
        <ion-slide-box ion-wizard>
            <ion-slide ion-wizard-step class="has-header">
                <div class="row">
                    <div class="col col-center">
                        <div class="card rounded">
                            <div class="item">
                                <h2 class="positive">Thanks for trying out this wizard!</h2>
                            </div>
                            <div class="item item-text-wrap">
                                <p>
                                    Click the buttons above
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ion-slide>
            <ion-slide ion-wizard-step condition="step2.name" class="has-header">
                <div class="row">
                    <div class="col col-center">
                        <div class="item item-input-inset">
                            <label class="item item-input-wrapper">
                                <i class="icon ion-search placeholder-icon"></i>
                                <input type="text" placeholder="Type something" ng-model="step2.name" autocomplete="off">
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col col-center">
                        <div class="card rounded" ng-show="step2.name">
                            <div class="item">
                                <h2 class="positive">Now you can move on! Click on the next button.</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </ion-slide>
            <ion-slide ion-wizard-step class="has-header">
                <div class="row">
                    <div class="col col-center">
                        <h3 class="positive">Thanks for completing the wizard!</h3>
                        <p>You can start using the app</p>
                    </div>
                </div>
            </ion-slide>
        </ion-slide-box>
    </ion-view>
```

