/**
 * Created by FixError on 17.12.2015.
 */
(function () {
    var app = angular.module('app.book', ['ui.router', 'toastr']);

    app.run(['$rootScope', '$log', function ($rootScope, $log) {
        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            $log.error('The requested state was not found: ', unfoundState);
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $log.error('An error occurred while changing states: ', error);
            $log.debug('event', event);
            $log.debug('toState', toState);
            $log.debug('toParams', toParams);
            $log.debug('fromState', fromState);
            $log.debug('fromParams', fromParams);
        });
    }]);
}());
/**
 * Created by FixError on 22.12.2015.
 */
(function () {
    angular.module('app.book')
    .config(function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });
}());
/**
 * Created by FixError on 22.12.2015.
 */
(function () {
    angular.module('app.book')
        .config(['$logProvider', '$stateProvider', '$urlRouterProvider', function ($logProvider, $stateProvider, $urlRouterProvider) {
            $logProvider.debugEnabled(false);
            $urlRouterProvider.otherwise('/');
            $stateProvider.
                state('menu', {
                    abstract: true,
                    url: '',
                    templateUrl: './view/menu.html',
                    controller: 'AbstractCtrl',
                    controllerAs: 'menu'
                })
                .state('menu.home', {
                    url: '/',
                    templateUrl: './view/home.html',
                    controller: 'HomeController',
                    controllerAs: 'home'
                })
                .state('menu.books', {
                    url: '/books',
                    templateUrl: './view/books.html',
                    controller: 'BookController',
                    controllerAs: 'books'
                })
                .state('menu.books.update', {
                    url: '/update/:id',
                    templateUrl: './view/books.update.html'
                });
        }]);
}());
/**
 * Created by FixError on 22.12.2015.
 */
(function () {
    angular.module('app.book')
        .config(function (toastrConfig) {
            angular.extend(toastrConfig, {
                autoDismiss: false,
                containerId: 'toast-container',
                maxOpened: 0,
                showDuration: "300",
                timeOut: "2000",
                // newestOnTop: true,
                positionClass: 'toast-top-center',
                preventDuplicates: false,
                preventOpenDuplicates: false,
                target: 'body'
            });
        });
}());
/**
 * Created by FixError on 22.12.2015.
 */
(function () {
    angular.module('app.book')
        .constant('myConfig',  {
            'base_url': 'https://vast-harbor-5498.herokuapp.com/',
    });

}());
/**
 * Created by FixError on 21.12.2015.
 */
(function () {
    angular.module('app.book')
        .controller('AbstractCtrl', ['bookService', 'notifier', '$state','$filter', '$log', AbstractCtrl]);
    function AbstractCtrl(bookService, notifier, $state, $filter, $log) {
        var vm = this;

        vm.reverseSort=false;

        var bookALL = function () {
            bookService.getBookAll()
                .then(function (books) {
                    vm.booksAll = books;
                }).catch(showError)
        };
        bookALL();
        vm.addBook = function (newNameBook, newAuthor, newData) {
            var timestamp = newData;
            var timestamp_date = timestamp.getFullYear() + "-" + (timestamp.getMonth() + 1) + "-" + timestamp.getDate(); // ===> move server

            var newBook = {
                nameBook: newNameBook,
                author: newAuthor,
                data: timestamp_date
            };
            bookService.addBook(newBook)
                .then(function (message) {
                    successInfo("Book " + newBook.nameBook + " add!");
                    vm.newNameBook="";
                    vm.newAuthor="";
                    vm.newData="";
                    bookALL();
                }).catch(showError)
        };
        vm.updateBook = function (updateID, updateNameBook, updateAuthor, updateData) {
            var timestamp_date;
            var timestamp = updateData;
            if (updateData) {
                timestamp_date = timestamp.getFullYear() + "-" + (timestamp.getMonth() + 1) + "-" + timestamp.getDate(); // ===> move server
            }
            var updateBook = {
                id: updateID,
                nameBook: updateNameBook,
                author: updateAuthor,
                data: timestamp_date ? timestamp_date : vm.updateData
            };
            $log.debug(updateBook);
            bookService.updateBook(updateBook)
                .then(function (message) {
                    successInfo("Book " + updateBook.nameBook + " update!");
                    bookALL();
                }).catch(showError)
            $state.go('menu.books',{inherit: false});
        };
        vm.removeBook = function (book) {
            bookService.deleteBook(book.id)
                .then(function (message) {
                    successInfo("Book " + book.nameBook + " delete!");
                    bookALL();
                }).catch(showError)
        };

        vm.bookIdFun = function () {
            var book_id = $state.params.id;
            bookService.getBookId(book_id)
                .then(function (books) {
                    var booksID = books;
                    vm.updateID = books.id;
                    vm.updateName = booksID.nameBook;
                    vm.updateAuthor = booksID.author;
                    vm.updateData = (booksID.data).slice(0, 10);
                }).catch(showError)
        };
        var orderBy= $filter('orderBy');

        vm.orderByField= function(predicate) {
            vm.predicate = predicate;
            vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
            vm.booksAll=orderBy(vm.booksAll, predicate, vm.reverse)
        };

        function showError(message) {
            notifier.error(message);
        }

        function successInfo(message) {
            notifier.success(message);
        }
    }
}());
/**
 * Created by FixError on 18.12.2015.
 */
(function () {
    angular.module('app.book')
        .controller('BookController', ['$state','$log', bookController]);
    function bookController($state, $log) {
        var vm = this;
        vm.goUpdate = function goUpdate(book_id){
            $state.go('menu.books.update',{id : book_id},{inherit: false});
        };
    }
}());
/**
 * Created by FixError on 18.12.2015.
 */
(function () {
    angular.module('app.book')
        .controller('HomeController', [menuController]);
    function menuController() {
        var vm = this;
    }
}());
/**
 * Created by FixError on 20.12.2015.
 */

(function () {

    angular.module('app.book')
        .factory('notifier', ['toastr',notifier]);

    function notifier(toastr) {
        return {
            success: success,
            error: error
        };

        function success(message) {
            toastr.success(message);
        }

        function error(message) {
            toastr.error(message);
        }
    }

}());
/**
 * Created by FixError on 18.12.2015.
 */
(function () {
    angular.module('app.book').service('bookService', ['myConfig','$http', '$q', '$log', bookService]);
    function bookService(myConfig, $http, $q, $log) {

        var me = this;

        me.getBookId = function getBookId(bookId) {
            return $http.get(myConfig.base_url + 'api/books/' + bookId)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error retrieving book: ' + response.statusText);
                    return $q.reject('Error retrieving book.');
                });
        };

        me.getBookAll = function getBookAll() {
            return $http.get(myConfig.base_url + 'api/books')
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error retrieving books: ' + response.statusText);
                    return $q.reject('Error retrieving books.');
                });
        };

        me.addBook = function addBook(newBook) {
            return $http.post(myConfig.base_url + 'api/books', newBook)
                .then(function (response) {
                    $log.debug('Add book:'  + "status:" + response.statusText);
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error retrieving books: ' + response.statusText);
                    return $q.reject('Error retrieving books.');
                });
        };

        me.deleteBook = function deleteBook(bookId) {
            return $http.delete(myConfig.base_url + 'api/books/' + bookId)
                .then(function (response) {
                    $log.debug('Delete book:' + "status:" + response.statusText);
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error delete books: ' + response.statusText);
                    return $q.reject('Error delete books.');
                });
        };

        me.updateBook = function updateBook(updateBook) {
            return $http.put(myConfig.base_url + 'api/books', updateBook)
                .then(function (response) {
                    $log.debug('Update book:' +  "status:" + response.statusText);
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error update books: ' + response.statusText);
                    return $q.reject('Error update books.');
                });
        };
    }
}());