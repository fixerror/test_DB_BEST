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
        vm.updateBook = function (updateID, updateNameBook, updateAuthor, updateData) {
            var timestamp_date;
            var timestamp = updateData;
            if (updateData) {
                timestamp_date = timestamp.getFullYear() + "-" + (timestamp.getMonth() + 1) + "-" + timestamp.getDate(); // ===> move server
            }
            var updateBook = {
                id: updateID,
                nameBook: updateNameBook,
                author: updateAuthor,
                data: timestamp_date ? timestamp_date : vm.updateData
            };
            $log.debug(updateBook);
            bookService.updateBook(updateBook)
                .then(function (message) {
                    successInfo("Book " + updateBook.updateBook + " update!");
                    bookALL();
                }).catch(showError)
            $state.go('menu.books',{inherit: false});
        };
        vm.removeBook = function (book) {
            bookService.deleteBook(book.id)
                .then(function (message) {
                    successInfo("Book " + book.nameBook + " delete!");
                    bookALL();
                }).catch(showError)
        };

        vm.bookIdFun = function () {
            var book_id = $state.params.id;
            bookService.getBookId(book_id)
                .then(function (books) {
                    var booksID = books;
                    vm.updateID = books.id;
                    vm.updateName = booksID.nameBook;
                    vm.updateAuthor = booksID.author;
                    vm.updateData = (booksID.data).slice(0, 10);
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