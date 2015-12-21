/**
 * Created by FixError on 18.12.2015.
 */
(function () {
    angular.module('app.book')
        .controller('MenuController', ['bookService', 'notifier', '$state', '$log', menuController]);
    function menuController(bookService, notifier, $state, $log) {
        var vm = this;
        bookService.getBookAll()
            .then(function (books) {
                vm.booksAll = books;
            }).catch(showError)

        function showError(message) {
            notifier.error(message);
        }
    }
}());