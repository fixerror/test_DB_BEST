/**
 * Created by FixError on 18.12.2015.
 */
(function () {
    angular.module('app.book').service('bookService', ['myConfig','$http', '$q', '$log', bookService]);
    function bookService(myConfig, $http, $q, $log) {

        var me = this;

        me.getBookId = function getBookId(bookId) {
            return $http.get(myConfig.base_url + 'api/books/' + bookId)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error retrieving book: ' + response.statusText);
                    return $q.reject('Error retrieving book.');
                });
        };

        me.getBookAll = function getBookAll() {
            return $http.get(myConfig.base_url + 'api/books')
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error retrieving books: ' + response.statusText);
                    return $q.reject('Error retrieving books.');
                });
        };

        me.addBook = function addBook(newBook) {
            return $http.post(myConfig.base_url + 'api/books', newBook)
                .then(function (response) {
                    $log.debug('Add book:'  + "status:" + response.statusText);
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error retrieving books: ' + response.statusText);
                    return $q.reject('Error retrieving books.');
                });
        };

        me.deleteBook = function deleteBook(bookId) {
            return $http.delete(myConfig.base_url + 'api/books/' + bookId)
                .then(function (response) {
                    $log.debug('Delete book:' + "status:" + response.statusText);
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error delete books: ' + response.statusText);
                    return $q.reject('Error delete books.');
                });
        };

        me.updateBook = function updateBook(updateBook) {
            return $http.put(myConfig.base_url + 'api/books', updateBook)
                .then(function (response) {
                    $log.debug('Update book:' +  "status:" + response.statusText);
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error update books: ' + response.statusText);
                    return $q.reject('Error update books.');
                });
        };
    }
}());