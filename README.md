# ionic-wizard — wizard directives

These are a set of directives for Ionic aimed at creating a startup wizard component using Ionic's ion-slide-box

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
Use this directive to attach a callback to the start button to launch the app. The button will be hidden and shown only
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
This directive must be added to each ion-slide to define each step of the wizard. A condition can be added that will be
evaluated before allowing the user to move forward. If the condition is not satisfied an event is triggered that can be used
to display any information.

```
<ion-slide ion-wizard-step condition="user.LastName != undefined">...</ion-slide>
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





