/**
 * Created by FixError on 18.12.2015.
 */
(function () {
    angular.module('app.book')
        .controller('BookController', ['$state','$log', bookController]);
    function bookController($state, $log) {
        var vm = this;
        vm.goUpdate = function goUpdate(book_id){
            $log.debug(book_id);
            $state.go('menu.books.update',{id : book_id},{inherit: false});
            $log.debug($state);
        }
    }
}());