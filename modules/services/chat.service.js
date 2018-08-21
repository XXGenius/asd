(function () {
    'use strict';

    angular.module('chat.service', []);

    angular.module('chat.service').factory('$getResponse', ['$q', '$http', getResponse]);


    function getResponse($q, $http) {

        return function () {
            var deferred = $q.defer();

            $http.get('https://golaso.io/tools/chat/data/response.json').then(function (result) {
                console.log(result.data);
                deferred.resolve(result.data);
            }, function (error) {
                console.error(error.message);
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }



})();
