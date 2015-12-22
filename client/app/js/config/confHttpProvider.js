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