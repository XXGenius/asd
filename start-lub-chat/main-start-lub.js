var app = angular.module('app', []);

app.controller('chat', function ($scope, fileReader, $window, $timeout) {
    $scope.imageSrc = "";
    $scope.currentMsg = 1;
    $scope.field = '';
    $scope.typeInput = 'text';
    $scope.typing = false;
    console.log($window);
    var self = this;
    self.messageWindowHeight = parseInt($window.innerHeight - 170) + 'px';
    $scope.$on("fileProgress", function (e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });


    $scope.user = {
        id: 1,
        name: '',
        email: ''
    };
    console.log($scope.user);

    $scope.responseMessages = [
        {
            id: 1,
            type: 'text',
            text: 'Ваше имя?',
            field: 'name'
        },
        {
            id: 2,
            type: 'text',
            text: 'Укажите адрес электронной почты',
            field: 'email'
        },
        // {
        //     id: 3,
        //     type: 'photo',
        //     text: 'Загрузите ваше фото.',
        //     field: 'avatar'
        // },
        {
            id: 3,
            type: 'text',
            text: 'Укажите ваш skype',
            field: 'skype'
        },
        {
            id: 4,
            type: 'text',
            text: 'Ваш город?',
            field: 'city'
        },
        {
            id: 5,
            type: 'text',
            text: 'Название проекта',
            field: 'project'
        },
        {
            id: 6,
            type: 'text',
            text: 'Опишите в нескольких предложениях, суть вашего проекта ',
            field: 'description'
        },
        {
            id: 7,
            type: 'text',
            text: 'Ссылка на сайт проекта',
            field: 'link'
        },
        {
            id: 8,
            type: 'checkbox',
            text: 'Стадия готовности продукта',
            field: 'Stage_of_product_readiness',
            variants: [
                'Только идея',
                'Продукт находится в стадии разработки',
                'Минимальная версия продукта (MVP), продаж нет',
                'Минимальная версия продукта (MVP), продажи есть',
                'Продукт полностью готов, продажи ведутся несистемно',
                'Продукт полностью готов, ведутся системные продажи'
            ]
        },
        {
            id: 9,
            type: 'checkbox',
            text: 'В какой сфере/сферах вы создаете проект? ',
            field: 'field_of_activity',
            variants: ['Ритейл',
                'Телемедецина / мед. технологии',
                'Хардвер',
                'Образовательные технологии'
            ]
        },
        {
            id: 10,
            type: 'checkbox',
            text: 'Сколько человек в команде проекта?',
            field: 'count_person',
            variants: [
                '1',
                '2',
                '3',
                '4',
                '5',
                'Более 5'
            ]
        },
        {
            id: 11,
            type: 'checkbox',
            text: 'Какие компетенции присутствуют в команде?',
            field: 'competence',
            variants: [
                'Специалист по маркетингу',
                'Специалист по продажам',
                'Разработчик',
                'Специалист по развитию бизнеса'
            ]
        },
        {
            id: 12,
            type: 'checkbox',
            text: 'Насколько команда вовлечена в проект?',
            field: 'interest',
            variants: [
                'У членов команды нет другой работы/стартапов, полностью вовлечены в этот бизнес',
                'CEO, технический специалист, маркеторолог полностью вовлечены в стартап, часть сотрудников занимается другими стартапами и не фултайм в команде',
                'У кого-то из CEO/технического специалиста/маркетолога есть другая работа/стартапы',
                'Делаем стартап в свободное от основной деятельности время, но готовы переключиться, если пройдут отбор в Акселератор и получат инвестиции'
            ]
        },
        {
            id: 13,
            type: 'text',
            text: 'ФИО и контакты основателя / лидера проекта',
            field: 'director'
        },
        {
            id: 14,
            type: 'text',
            text: 'Есть ли у основателя / лидера проекта опыт ведения собственного бизнеса?',
            field: 'experience'
        },
        {
            id: 15,
            type: 'text',
            text: 'Опишите планы развития на год',
            field: 'experience'
        },
        {
            id: 16,
            type: 'text',
            text: 'Оформлено ли юридическое лицо? В какой юрисдикции?',
            field: 'jurisdiction'
        },
        {
            id: 17,
            type: 'text',
            text: 'Как вы узнали о Startup Lab?',
            field: 'source'
        }
    ];

    $scope.allMessages = [];

    $scope.responses = [];

    $scope.variants = [];

    // Selected fruits
    $scope.selection = [];

    // Toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(variantName) {
        var idx = $scope.selection.indexOf(variantName);

        // Is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // Is newly selected
        else {
            $scope.selection.push(variantName);
        }
        console.log($scope.selection)
    };


    $scope.responseMsg = function () {
        $scope.responseMessages.forEach(function (message) {
            if (message.id === $scope.currentMsg) {
                $scope.typeInput = message.type;
                if (message.type === 'checkbox') {
                    $scope.variants = message.variants;
                }
                if (message.id === 7) {
                    $scope.message = 'https://'
                }
                $scope.field = message.field;
                var hours = new Date().getHours();
                var minutes = new Date().getMinutes();
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                $scope.date = hours + ":" + minutes;
                $scope.allMessages.push({text: message.text, from: 'bot'})
                $scope.typing  = false;
            }
        });
        $scope.currentMsg += 1;

    };

    $scope.timer = $timeout(function(){
        console.log(11111);
    }, 1000);


    $scope.sendMessage = function () {
        console.log($scope.message);
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        $scope.date = hours + ":" + minutes;
        if ($scope.field) {
            $scope.user[$scope.field] = $scope.message;
        }
        $scope.allMessages.push({text: $scope.message, from: 'user'});
        $scope.message = '';
        $scope.selection = [];
        console.log($scope.user);
        $scope.typing = true;
        $timeout(function(){
            $scope.responseMsg();
        }, 1000);
    };

    $scope.sendVarChek = function () {
        console.log($scope.selection);
        $scope.message = $scope.selection;
        $scope.sendMessage();
    };

    $scope.responseMsg();
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

app.directive("ngFileSelect", function (fileReader, $timeout) {
    return {
        scope: {
            ngModel: '='
        },
        link: function ($scope, el) {
            function getFile(file) {
                fileReader.readAsDataUrl(file, $scope)
                    .then(function (result) {
                        $timeout(function () {
                            $scope.ngModel = result;

                        });
                    });
            }

            $scope.typeInput = 'text';
            el.bind("change", function (e) {
                var file = (e.srcElement || e.target).files[0];
                getFile(file);
            });
        }
    };
});

app.factory("fileReader", function ($q, $log) {
    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress", {
                total: event.total,
                loaded: event.loaded
            });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        console.log(deferred.promise);
        return deferred.promise;

    };

    return {
        readAsDataUrl: readAsDataURL
    };
});
