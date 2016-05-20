(function (angular) {

    var theModule = angular.module('notesView', ['ui.bootstrap']);

    theModule.controller('notesViewController', ['$scope', // <-- the 'ViewModel', the section of the view, object that exposes the data to the view
        '$window',  // The Window - Another object provided by Angular
        '$http',    // HTTP client - Another object provided by Angular
        function ($scope, $window, $http) {
            $scope.notes = [];
            $scope.newNote = createBlankNote();

            // categoryName is last part of url...
            var urlParts = $window.location.pathname.split('/');
            var categoryName = urlParts[urlParts.length - 1];

            var notesUrl = '/api/notes/' + categoryName;

            $http.get(notesUrl).then(function (result) {
                $scope.notes = result.data;
            },
                function (err) {
                    alert(err);
                });

            /* start socket.io stuff **************************/

            // initiate socket.io connection with the server.
            var socket = io.connect(); // can take a url param, but we don't need to do that, since the page was served by the same server that has the socket we're connecting to.

            socket.emit('join category', categoryName);

            // listen out for 'broadcast note' events that are emitted from the server (see updater\index.js).
            socket.on('broadcast note', function (msg) {
                $scope.notes.push(msg);

                //Databinding raise event to refresg
                //$scope.$apply();
            });

            /* end socket.io stuff **************************/

            $scope.save = function () {
                $http.post(notesUrl, $scope.newNote)
                    .then(function (result) {
                        // success
                        $scope.notes.push(result.data);
                        $scope.newNote = createBlankNote();
                        socket.emit('newNote', { category: categoryName, note: result.data });
                    },
                    function (err) {
                        alert(err);
                    });
            };

            function createBlankNote() {
                return {
                    note: '',
                    color: 'yellow'
                };
            }

        }
    ]);

})(window.angular);