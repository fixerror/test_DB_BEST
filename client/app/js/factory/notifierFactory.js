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