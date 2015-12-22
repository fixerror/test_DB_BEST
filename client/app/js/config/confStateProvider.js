/**
 * Created by FixError on 22.12.2015.
 */
(function () {
    angular.module('app.book')
        .config(['$logProvider', '$stateProvider', '$urlRouterProvider', function ($logProvider, $stateProvider, $urlRouterProvider) {
            $logProvider.debugEnabled(true);
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