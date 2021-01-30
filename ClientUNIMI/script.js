/// 
// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute']);
var url = "http://localhost:1337/api/v1/";


// configure our routes
scotchApp.config(function ($routeProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'mainController'
		})

		// route for the about page
		.when('/about', {
			templateUrl: 'pages/about.html',
			controller: 'aboutController'
		})

		// route for the contact page
		.when('/contact', {
			templateUrl: 'pages/contact.html',
			controller: 'contactController'
        })
    // route for the contact page
		.when('/schedules', {
            templateUrl: 'pages/schedules.html',
            controller: 'schedulingCtrl'
        })
        .when('/addSchedules', {
            templateUrl: 'pages/addSchedules.html',
        controller: 'addScheduleCtrl'
    });
});

// create the controller and inject Angular's $scope
scotchApp.controller('mainController', function ($scope, $http) {
	// create a message to display in our view

    $http({
        method: 'POST',
        url: url + 'authentication/login',
        data: {
            email: "viola.viventi@gmail.com",
            password: "test",
            application: "mia app",
            headers: { 'Content-Type': 'application/json' }
        }
    }).success(function (response) {
        $scope.token = response.token;
        writeLog("12", "message test", $scope.token);
        $scope.message = 'Everyone come and see how good I look!';
    })
 });

scotchApp.controller('aboutController', function ($scope) {
	$scope.message = 'Look! I am an about page.';
});

scotchApp.controller('contactController', function ($scope) {
	$scope.message = 'Contact us! JK. This is just a demo.';
});

scotchApp.controller('addScheduleCtrl', function ($scope) {
    $scope.message = 'Add a schedule for yuo room.';
});


scotchApp.controller('loginCtrl', function ($scope, $http) {

    $http({
        method: 'POST',
        url: url + 'authentication/login',
        data: {
            email: "viola.viventi@gmail.com",
            password: "test",
            application: "mia app",
            headers: { 'Content-Type': 'application/json' }
        }
    }).success(function (response) {

        $scope.token = response.token;

        $http({
            method: 'GET',
            url: url + 'meeting?application=mia app',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.token }

        }).success(function (response) {
            $scope.Scheduling = response;
        });
    });

});


scotchApp.controller('schedulingCtrl', function ($scope, $http) {

    $http({
        method: 'POST',
        url: url + 'authentication/login',
        data: {
            email: "viola.viventi@gmail.com",
            password: "test",
            application: "mia app",
            headers: { 'Content-Type': 'application/json' }
        }
    }).success(function (response) {

        $scope.token = response.token;

        $http({
            method: 'GET',
            url: url + 'meeting?application=mia app',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.token }

        }).success(function (response) {
            $scope.Scheduling = response;
        });
    });

});


scotchApp.controller('addScheduleCtrl', function ($rootScope, $scope, $http) {
    $scope.name = null;
    $scope.age = null;
    $scope.adress = null;
    $scope.lblMsg = null;
    $scope.Scheduling = {};

    $http({
        method: 'POST',
        url: url + 'authentication/login',
        data: {
            email: "viola.viventi@gmail.com",
            password: "test",
            application: "mia app",
            headers: { 'Content-Type': 'application/json' }
        }
    }).success(function (response) {
        $scope.token = response.token;
        $http({
            method: 'GET',
            url: url + 'rooms/?application=mia app',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.token }

        }).success(function (response) {
            $scope.roomList = response;
        });
    });

    $scope.addSchedule = function (userId, idRoom, dataDa, dataA)
    {
      
        $http({
            method: 'POST',
            url: url + 'authentication/login',
            data: {
                email: "viola.viventi@gmail.com",
                password: "test",
                application: "mia app",
                headers: { 'Content-Type': 'application/json' }
            }
        }).success(function (response, dateFrom, dateTo) {
            $scope.token = response.token;
            $http({
                method: 'GET',
                url: url + 'meeting/?application=mia app',
                data: {
                    userId: userId,
                    idRoom: idRoom,
                    dateFrom: dataDa,
                    dateTo: dataA
                },
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.token }
            }).success(function (response) {

            });
        });

    }

});

function writeLog(userId, message, token) {

    $.ajax({
        method: 'POST',
        url: url + 'log/?application=mia app',
        data: {
            idUser: userId,
            message: message
        },
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },       
        success : function(resp) {
            alert('log OK');
        },
        failure : function(resp) {
            alert('Something went wrong in writing log. Please contact system administgrator');
        }
    })  
}

function login() {
    $.ajax({
        method: 'POST',
        url: url + 'authentication/login',
        data: {
            email: "viola.viventi@gmail.com",
            password: "test",
            application: "mia app",
            headers: { 'Content-Type': 'application/json' }
        }
    }).success(function (response) {
        $scope.token = response.token;
        writeLog("12", "message test", $scope.token);
        $scope.message = 'Everyone come and see how good I look!';
    })
}