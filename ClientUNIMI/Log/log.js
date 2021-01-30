function writeLog(userId, message, token) {
       
    $http({
        method: 'GET',
        url: url + 'meeting/?application=mia app',
        data: {
            userId: userId,
            message: message
        },
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    }).success(function (resp) {
        alert('log OK');
    }).failure(function (resp) {
        alert('Something went wrong in writing log. Please contact system administgrator');
    });
    
}