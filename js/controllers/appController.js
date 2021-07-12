angular.module("appWeather").controller("appController", function($scope, weatherService, $q) {

    $scope.showButtonCard = true;
    $scope.showSinglecity = false;
    $scope.showCidades = true;
    $scope.showInfoCity = false;

    var cidades = [
        "criciuma",
        "dourados",
        "campo grande",
        "florianopolis",
        "campinas",
        "mogi das cruzes",
        "lages",
        "rio de janeiro",
        "manaus",
        "belo horizonte",
        "sao paulo"
    ]

    var promisses = [];

    $scope.cidades = [];

    for(let i = 0 ; i < cidades.length; i++){       
        var promisse = weatherService.findWeatherCity(cidades[i]).then((response) => {  
            console.log(response.data) 
            var cidade = {
                id: response.data.id,
                icon:  "assets/icons/" + response.data.weather[0].icon + ".png",
                nome : response.data.name,
                temp: (response.data.main.temp - 273.15).toFixed(0),
                temp_max : (response.data.main.temp_max - 273.15).toFixed(0),
                temp_min : (response.data.main.temp_min - 273.15).toFixed(0),
                temp_feels_like : (response.data.main.feels_like - 273.15).toFixed(0)
            }
            return cidade;
        })

        promisses.push(promisse);
    } 

    $q.all(promisses).then(function(results){
        $scope.cidades = results;
        console.log(results)
    }) 
    
    $scope.loadSingle = (nome) => {
        weatherService.findWeatherCity(nome).then((response) => {
            $scope.cidade = {
                id: response.data.id,
                icon:  "assets/icons/" + response.data.weather[0].icon + ".png",
                nome : response.data.name,
                temp: (response.data.main.temp - 273.15).toFixed(0),
                temp_max : (response.data.main.temp_max - 273.15).toFixed(0),
                temp_min : (response.data.main.temp_min - 273.15).toFixed(0),
                temp_feels_like : (response.data.main.feels_like - 273.15).toFixed(0),
                wind : (response.data.wind.speed * 3.6).toFixed(0),
                humidity : response.data.main.humidity,
                pressure : response.data.main.pressure

            }
            console.log(response.data);
        })
    }


    $scope.buscarCidade = (cidadeNome) => {
        $scope.showCidades = false;
        $scope.showSinglecity = true;
        var input = document.querySelector("#search-cidade");
        var cidadeNome = input.value; 
        $scope.loadSingle(cidadeNome);
        input.value = "";
    }

    $scope.infoCidade = (nome) => {
        $scope.showCidades = false;
        $scope.showSinglecity = false;
        $scope.showInfoCity = true;
        $scope.loadSingle(nome);
    }

    $scope.mostrarCidades = () => {
        $scope.showSinglecity = false;
        $scope.showInfoCity = false;
        $scope.showCidades = true;
        
    }

});
