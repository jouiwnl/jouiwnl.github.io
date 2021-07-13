angular.module("appWeather").service("weatherService", function($http, config) {
    
    const apiKey = "304ffa35b779267ea5282771e39679f7"
    
    this.findWeatherCity = (cityName) => {
        return $http.get(config.apiUrl + "weather?q=" + cityName + "&appid=" + apiKey);
    }

    this.findFurther = (cityId) => {
        return $http.get(config.apiUrl + "forecast?id=" + cityId + "&appid=" + apiKey);
    }

    this.findByCoords = (lat, lon) => {
        return $http.get(config.apiUrl + "weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey);
    }

});
