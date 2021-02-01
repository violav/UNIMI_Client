/// 
// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute']);
var url = "http://localhost:1337/api/v1/";


angular.module('scotchApp')
    .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, authProvider) {
        $rootScope.$on('$routeChangeStart', function (event) {

            if ($location.path() != "/signUp"  ) {
                if (!authProvider.isLoggedIn()) {
                    console.log('DENY : Redirecting to Login');
                    event.preventDefault();
                    $location.path('/login');
                }
                else {
                    console.log('ALLOW');
                }
            }
        });
    }]);


// configure our routes
scotchApp.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })
        //route for login page
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'
        })

        //route for signup page
        .when('/signUp', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'
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
        })
       .when('/roomUser', {
           templateUrl: 'admin/roomUser.html',
           controller: 'roomUserController'
       });
});

//homeController, loginController, contactController, schedulingCtrl,addScheduleCtrl

// create the controller and inject Angular's $scope
//scotchApp.controller('loginController', function ($rootScope, $scope, $http) {
// create a message to display in our view
// var utenteId = "",
scotchApp.controller('loginController', ['$rootScope', '$scope', 'Auth', '$http', '$location', function ($rootScope, $scope, Auth, $http, $location) {
    //submit
    $scope.email = null;
    $scope.password = null;
    $scope.message = null;
    $scope.isSignUp = false;
    $scope.pageTitle = "Login";
    

    //sicurezza pwssword
    var strongRegularExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumRegularExp = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    $scope.checkpwdStrength = {
    
    };

  
    if ($location.path() == "/signUp") 
    {
        $scope.isSignUp = true;
        $scope.pageTitle = "Sign Up"       
    }

    $scope.validationInputPwdText = function (value) {
            if (strongRegularExp.test(value)) {
                if (mediumRegularExp.test(value)) {
                $scope.checkpwdStrength["background-color"] = "orange";
                } else {
                    $scope.checkpwdStrength["background-color"] = "red";
                }
            };
        }

    $scope.login = function () {

        $http({
            method: 'POST',
            url: url + 'authentication/login',
            data: {
                email: $scope.email,
                password: $scope.password,
                application: "mia app",
                headers: { 'Content-Type': 'application/json' }
            }
        }).success(function (response) {
            $rootScope.user = response.id;
            $rootScope.token = response.token;

            Auth.setUser($rootScope.user); //Update the state of the user in the app           

            writeLog($rootScope.user, "login", $rootScope.token);
            $scope.message = 'Logged in';
            $location.path('/home'); 
        }).error(function () {
            $scope.message = 'Credentials not valid. Please contact administrator to retrieve your credentials or signup';
            $scope.isSignUp = true;

        });

    };



    $scope.singUp = function () {

        if (!strongRegularExp.test($scope.password)) {
            $scope.message = 'Password rules : at least 8 characters long with special caracter , upper case and a number';
        }
        else {
            $http({
                method: 'POST',
                url: url + 'authentication/register',
                data: {
                    name: $scope.name,
                    email: $scope.email,
                    password: $scope.password,
                    application: "mia app",
                    headers: { 'Content-Type': 'application/json' }
                }
            }).success(function (response) {
                $rootScope.user = response.id;
                $rootScope.token = response.token;

                Auth.setUser($rootScope.user); //Update the state of the user in the app           

                writeLog($rootScope.user, "login", $rootScope.token);
                $scope.message = 'Logged in';
                $location.path('/home');
            }).error(function () {
                $scope.message = 'Signup failed. Is possible that account with this mail already exists. Please contact administrator to retrieve your credentials or signup';
            });

        };
    }

    $scope.logout = function ()
    {
        alert('fuori');
        $rootScope.user = '';
        $rootScope.token = '';

        Auth.setUser('');
        $scope.message = 'Logged out';
        writeLog($rootScope.user, "loged out", $scope.token);
    }
}]);



scotchApp.controller('roomUserController', function ($scope, $rootScope, $http, $location) {

    if ($rootScope.user != "60151ee4d72cf63840fa326e") {
        $location.path('/');
    }
    
        $http({
            method: 'GET',
            url: url + 'rooms/',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $rootScope.token }

        }).success(function (response) {
            $scope.roomList = response;
        });

        $http({
            method: 'GET',
            url: url + 'users/',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $rootScope.token }

        }).success(function (response) {
            $scope.studentList = response;
        });

        $scope.addRoomStudent = function (room, utente) {

            $http({
                method: 'POST',
                url: url + 'userRoom/',
                data: {
                    user: utente,
                    room: room
                },
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $rootScope.token }

            }).success(function (response) {
                alert('allowed');
                writeLog($rootScope.user, 'addes room ' + $scope.room + ' to user : ' + $scope.user, $rootScope.token)
                $scope.msg = "room added"
                // $scope.Scheduling = response;
            }).error(function (response) {
                alert('not allowed');
                $scope.msg = "Something went wrong"
            })
        }
});



scotchApp.controller('homeController', function ($rootScope, $scope, $http) {

    //retrieve contents
    $http.get("../Contents/contentText.json")
        .success((success) => {
            $scope.pageTitle = success.home.pagTitle;
            $scope.subTitle = success.home.subTitle;
        });


    //get user data subTitle
    $http({
        method: 'GET',
        url: url + 'users/' + $rootScope.user , //+ '?application=mia app',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $rootScope.token }
    }).success(function (response) {
        $scope.message = "Hello " + response.name;

        $http({
            method: 'GET',
            url: url + 'log/' + $rootScope.user, // + '?application=mia app',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $rootScope.token }
        }).success(function (response) {
            if (response.length > 0) {
                var date = moment(response[0].dateTime).format('DD/MM/YYYY HH:mm');
                $scope.message +=   ",  Last login : " + date;// response[0].dateTime;
            }
            else
            {
                $scope.message += "First login  ";
            }
        })
    });
});

scotchApp.controller('mainController', ['$scope', 'Auth', '$location', function ($scope, Auth, $location) {
    //check for login
    $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

        if (!value && oldValue) {
            console.log("Disconnect");
            $location.path('/login');
        }
        if (value) {
            //the user is logged
            console.log("Connect");
            $location.path('/'); 
        }

    }, true);
}]
);

scotchApp.controller('aboutController', function ($scope) {
    $scope.message = 'Look! I am an about page.';
});

scotchApp.controller('contactController', function ($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

scotchApp.controller('addScheduleCtrl', function ($scope) {
    $scope.message = 'Add a schedule for yuo room.';
});


scotchApp.controller('schedulingCtrl', function ($scope, $rootScope, $http) {

    $http({
        method: 'GET',
        url: url + 'meetingByUser/' + $rootScope.user + '?application=mia app',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $rootScope.token }

    }).success(function (response) {
        $scope.Scheduling = response;
    });

    $scope.deleteScheduling = function (toDelete) {

        $http({
            method: 'DELETE',
            url: url + 'meeting/' + toDelete.id,
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $rootScope.token }

        }).success(function (response) {
            writeLog($rootScope.user, 'delete scheduling ' + toDelete.id, $rootScope.token)
            $scope.msg = "Your booking has successfully deleted"
           // $scope.Scheduling = response;
        }).error(function (response) {
            $scope.isError = true;
            $scope.msg = "Something went wrong in your cancelation"
        }) 
    }
});


scotchApp.controller('addScheduleCtrl', function ($rootScope, $scope, $http, $location) {
    $scope.name = null;
    $scope.age = null;
    $scope.adress = null;
    $scope.lblMsg = null;
    $scope.Scheduling = {};

    $http({
        method: 'GET',
        url: url + 'rooms',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $rootScope.token }

    }).success(function (response) {
        $scope.roomList = response;
    });

    $scope.addSchedule = function (idRoom, dataDa, dataA) {

        check = confirm("Do you confirm schedulation?")
        if (check) {

            $http({
                method: 'POST',
                url: url + 'meeting', ///?application=mia app',
                data: {
                    user: $rootScope.user,
                    dateFrom: dataDa,
                    dateTo: dataA,
                    room: idRoom
                },
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $rootScope.token }
            }).success(function (response) {
                $location.path('/schedules');
            }).error(function (response) {
                $scope.isError = true;
                $scope.message = "unable to schedule the room " + response;
            });
        } else {
            alert('non conferato');
        }
    }

});




function writeLog(userId, message, token) {

    $.ajax({
        method: 'POST',
        url: url + 'log',
        data: JSON.stringify({
            idUser: userId,
            message: message
        }),
        dataType: 'JSON',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        success: function (resp) {
        },
        failure: function (resp) {
            alert('Something went wrong in writing log. Please contact system administgrator');
        }
    })
}


angular.module('scotchApp')
    .factory('Auth', function () {
        try {
            var user;
            return {
                setUser: function (aUser) {
                    user = aUser;
                },
                isLoggedIn: function () {
                    return (user) ? user : false;
                }
            };
        }
        catch (ecc) { alert('factory -> ' + ecc.message); }
    });