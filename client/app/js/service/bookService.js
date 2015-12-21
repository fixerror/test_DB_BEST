/**
 * Created by FixError on 18.12.2015.
 */
(function () {
    angular.module('app.book').service('bookService', ['$http', '$q', '$log', bookService]);
    function bookService($http, $q, $log) {

        var me = this;

        me.getBookId = function getBookId(bookId) {
            return $http.get('api/books/' + bookId)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error retrieving book: ' + response.statusText);
                    return $q.reject('Error retrieving book.');
                });
        };

        me.getBookAll = function getBookAll() {
            return $http.get('http://localhost:8080/' + 'api/books')
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error retrieving books: ' + response.statusText);
                    return $q.reject('Error retrieving books.');
                });
        };
        me.addBook = function addBook(newBook) {
            return $http.post('http://localhost:8080/' + 'api/books',
                    newBook
                )
                .then(function (response) {
                    $log.log('Add book:'  + "status:" + response.statusText);
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error retrieving books: ' + response.statusText);
                    return $q.reject('Error retrieving books.');
                });
        }
        me.deleteBook = function deleteBook(bookId) {
            return $http.delete('http://localhost:8080/' + 'api/books/' + bookId)
                .then(function (response) {
                    $log.log('Delete book:' + "status:" + response.statusText);
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error delete books: ' + response.statusText);
                    return $q.reject('Error delete books.');
                });
        };

        me.updateBook = function updateBook(bookId) {
            return $http.put('api/books/' + bookId, {params: {bookId: bookId}})
                .then(function (response) {
                    $log.log('Update book:' + response.bookId + "status:" + response.statusText);
                    return $q.reject('Update book.');
                })
                .catch(function (response) {
                    $log.error('Error update books: ' + response.statusText);
                    return $q.reject('Error update books.');
                });
        };
    }
}());