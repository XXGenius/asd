'use strict';
var app = angular.module('app', ['angularFileUpload', 'chat.service']);

app.controller('chat', function ($scope, $window, $timeout, $http, FileUploader, $getResponse) {
    $scope.imageSrc = "";
    $scope.currentMsg = 1;
    $scope.field = '';
    $scope.typeInput = 'text';
    $scope.typing = false;
    $scope.fileitem = '';
    $scope.allMessages = [];
    $scope.responses = [];
    $scope.variants = [];
    $scope.selection = [];
    var self = this;
    self.messageWindowHeight = parseInt($window.innerHeight - 170) + 'px';


    $scope.responseMessages = [];

    initDefault();

    function initDefault() {
        $getResponse().then(function (data) {
            $scope.responseMessages = data;
            console.log(data);
        }, function (error) {
            $scope.phones = null;
        })
    }


    $scope.user = {
        id: 1
    };

    function requestBitrix() {
        $http.post("bitrix.php", $scope.user).then(function success(response) {
            console.info(response.data)
        });

    }


    $scope.toggleSelectionCheck = function toggleSelection(variantName) {
        var idx = $scope.selection.indexOf(variantName);

        // Is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // Is newly selected
        else {
            $scope.selection.push(variantName);
        }
    };

    $scope.toggleSelection = function toggleSelection(variantName) {
        var idx = $scope.selection.indexOf(variantName);

        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        else {
            $scope.message = variantName.text;
            if (variantName.text === '1-3 часа') {
                $scope.currentMsg = 7;
            } else if (variantName.text === '4-6 часа') {
                $scope.currentMsg = 8;
            } else if (variantName.text === 'Да') {
                $scope.currentMsg = 13;
            } else if (variantName.text === 'Нет') {
                $scope.currentMsg = 14;
            }
            else {
                $scope.currentMsg = 9;
            }
            $scope.sendMessage();
        }
    };

    $scope.responseMsg = function () {
        $scope.responseMessages.forEach(function (message) {
            if (message.id === $scope.currentMsg) {
                $scope.typeInput = message.type;
                if (message.type === 'hard_checkbox') {
                    $scope.variants = message.variants;
                }
                if (message.type === 'checkbox') {
                    $scope.variants = message.variants;
                }
                $scope.field = message.field;
                var hours = new Date().getHours();
                var minutes = new Date().getMinutes();
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                $scope.date = hours + ":" + minutes;
                $scope.allMessages.push({text: message.text, from: 'bot', anim: false});
                $scope.typing = false;
                $scope.allMessages[$scope.allMessages.length - 1].anim = true;
            } else if ($scope.currentMsg === 15) {
                $scope.field = message.field;
                hours = new Date().getHours();
                minutes = new Date().getMinutes();
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                $scope.date = hours + ":" + minutes;
                $scope.allMessages.push({
                    text: 'Отлично, ваша анкета готова и отправлена на рассмотрение',
                    from: 'bot'
                });
                $scope.allMessages[$scope.allMessages.length - 1].anim = true;
                $scope.currentMsg = 1;
                $scope.typing = false;
                $scope.typeInput = 'good';
                requestBitrix();
            }
        });
        $scope.currentMsg += 1;

    };


    $scope.sendMessage = function () {
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        $scope.date = hours + ":" + minutes;
        if ($scope.field) {
            $scope.user[$scope.field] = $scope.message;
        }
        $scope.allMessages.push({text: $scope.message, from: 'user', anim: false});
        $scope.message = '';
        $scope.selection = [];
        $scope.allMessages[$scope.allMessages.length - 1].anim = true;
        $scope.typing = true;
        $timeout(function () {
            $scope.responseMsg();
        }, 2000);

    };

    $scope.sendVarChek = function () {

        if ($scope.selection[0].answer) {
            var message = $scope.selection[0].answer;
            $scope.typeInput = message.type;
            $scope.variants = message.variants;
            $scope.field = message.field;
            var hours = new Date().getHours();
            var minutes = new Date().getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            $scope.date = hours + ":" + minutes;
            $scope.allMessages.push({text: message.text, from: 'bot', anim: false});
            $scope.typing = false;
            $scope.allMessages[$scope.allMessages.length - 1].anim = true;
            $scope.typing = true;
            $scope.selection = [];
            $scope.currentMsg += 1;
        } else if ($scope.selection[0].text) {
            $scope.message = $scope.selection[0].text;
            $scope.currentMsg += 1;
            $scope.sendMessage();
        } else {
            $scope.message = $scope.selection[0];
            $scope.sendMessage();
        }

    };

    $scope.$on("fileProgress", function (e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });

    var uploader = $scope.uploader = new FileUploader({
        url: 'upload.php'
    });

    // FILTERS

    // a sync filter
    uploader.filters.push({
        name: 'syncFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // an async filter
    uploader.filters.push({
        name: 'asyncFilter',
        fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
            setTimeout(deferred.resolve, 1e3);
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
    };
    uploader.onAfterAddingFile = function (fileItem) {
        $scope.fileitem = fileItem;
    };
    uploader.onBeforeUploadItem = function (item) {
    };
    uploader.onProgressItem = function (fileItem, progress) {
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.imageSrc = 'uploads/' + fileItem.file.name;
        $scope.user.photo = 'https://golaso.io/tools/chat/uploads/' + fileItem.file.name;
    };
    uploader.onCompleteAll = function () {
    };

    $timeout(function () {
        $scope.$watch('imageSrc', function () {
            $scope.responseMsg()
        });
    }, 500);


});

app.directive('scrollToBottom', function ($timeout, $window) {
    return {
        scope: {
            scrollToBottom: "="
        },
        restrict: 'A',
        link: function (scope, element, attr) {
            scope.$watchCollection('scrollToBottom', function (newVal) {
                if (newVal) {
                    $timeout(function () {
                        element[0].scrollTop = element[0].scrollHeight;
                    }, 0);
                }

            });
        }
    };
});

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

