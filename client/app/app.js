/**
 * Created by FixError on 17.12.2015.
 */
(function () {
    var app = angular.module('app', ['ui.router']);
    app.config(['$logProvider', '$stateProvider', '$urlRouterProvider', function ($logProvider, $stateProvider, $urlRouterProvider) {
        $logProvider.debugEnabled(true);
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('menu', {
                url: '/',
                templateUrl: './view/menu.html',
                controller: 'MenuController',
                controllerAs: 'menu'
            })
            .state('books', {
                url: '/books',
                templateUrl: './view/books.html',
                controller: 'BookController',
                controllerAs: 'books'
            });
    }]);

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