/**
 * Created by FixError on 17.12.2015.
 */
(function () {
    var app = angular.module('app.book', ['ui.router', 'toastr']);
    app.config(['$logProvider', '$stateProvider', '$urlRouterProvider', function ($logProvider, $stateProvider, $urlRouterProvider) {
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
                        controller: 'MenuController',
                        controllerAs: 'home'
            })
            .state('menu.books', {
                        url: '/books',
                        templateUrl: './view/books.html',
                        controller: 'BookController',
                        controllerAs: 'books'
            });

    }]);
    app.config(function (toastrConfig) {
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

    app.config(function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

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