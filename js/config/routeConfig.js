angular.module("appWeather").config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix("");

    $routeProvider.when("/app", {
        templateUrl: "view/app.html",
        controller: "appController"
    });

    $routeProvider.otherwise({
        redirectTo: "/app"
    });
});
