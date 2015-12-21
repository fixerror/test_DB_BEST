/**
 * Created by FixError on 21.12.2015.
 */
(function () {
    angular.module('app.book')
        .controller('AbstractCtrl', ['bookService', 'notifier', '$state', '$log', AbstractCtrl]);
    function AbstractCtrl(bookService, notifier, $state, $log) {
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
        vm.updateBook = function (updateNameBook, updateAuthor, updateData) {
            var timestamp = updateData;
            var timestamp_date = timestamp.getFullYear() + "-" + (timestamp.getMonth() + 1) + "-" + timestamp.getDate(); // ===> move server

            var updateBook = {
                nameBook: updateNameBook,
                author: updateAuthor,
                data: timestamp_date
            };
            bookService.updateBook(updateBook)
                .then(function (message) {
                    successInfo("Book " + updateBook.updateBook + " update!");
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