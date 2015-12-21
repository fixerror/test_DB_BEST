/**
 * Created by FixError on 18.12.2015.
 */
(function () {
    angular.module('app.book')
        .controller('BookController', ['bookService', 'notifier', '$state', '$log', bookController]);
    function bookController(bookService, notifier, $state, $log) {
        var vm = this;
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
                    bookALL();
                }).catch(showError)
        };
        vm.removeBook = function (book) {
            bookService.deleteBook(book.id)
                .then(function (message) {
                    successInfo("Book " + book.nameBook + " delete!");
                    bookALL();
                }).catch(showError)
        };

        function showError(message) {
            notifier.error(message);
        }

        function successInfo(message) {
            notifier.success(message);
        }
    }
}());