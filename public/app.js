var app = angular.module("booktrack", ["ngRoute"]);  //app name and injections (router)


//routes with ngroute ======================================
app.config(function($locationProvider, $routeProvider) {
	//activate html5 to remove "#" from URLs
	$locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    //single page routes
	$routeProvider
	.when('/', {
      templateUrl: 'view/home.html',            
     })

	.when('/add', {
        templateUrl: 'view/add.html',
        controller: 'addCtrl'	
     })
        
    .when('/list', {
	    templateUrl: 'view/list.html',
	    controller: 'listCtrl'	    
    })

     .when('/single:id', {
        templateUrl: 'view/single.html',
        controller: 'singleCtrl'
    })

});

// controllers  ======================================

//list all books
app.controller('listCtrl', function($http, $scope) {
	   $http.get('/api').success(function(data) {
	   $scope.books = data;
	});

$scope.deleteBook = function(id) {
        $http.delete('/api/' + id)
            .success(function(data) {
                $scope.books = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };



});

//add book
app.controller('addCtrl', function($scope, $http, $location) {
	    $scope.save = function() {
       $http.post('/api', $scope.book).success(function(data) {
          $scope.book = data;
          $location.path('/list');
       })
    }
});

//list one book
app.controller('singleCtrl', function($scope, $http, $location) {
	 

});






