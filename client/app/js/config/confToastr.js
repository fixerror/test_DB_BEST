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