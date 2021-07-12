angular.module("appWeather").controller("appController", function($scope, weatherService, $q) {

    $scope.showCidades = true;

    var cidades = [
        {id: 1, nome: "criciuma"},
        {id: 2, nome: "dourados"},
        {id: 3, nome: "corumba"}
    ]

    var promisses = [];

    $scope.cidades = [];

    for(let i = 0 ; i < cidades.length; i++){       
        var promisse = weatherService.findWeatherCity(cidades[i].nome).then((response) => { 
            console.log(response.data)   
            var cidade = {
                id: response.data.id,
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

    $scope.mostrarPrevisaoSemana = (id) => {
        const cityId = id;
        console.log(cityId);

        weatherService.findFurther(id).then((response) => {
            $scope.cidade = {
                diaSemana: "",
                temp_0: (response.data.list[0].main.temp - 273.15).toFixed(0),
                temp_1: (response.data.list[8].main.temp - 273.15).toFixed(0),
                temp_2: (response.data.list[16].main.temp - 273.15).toFixed(0),
                temp_3: (response.data.list[24].main.temp - 273.15).toFixed(0),
                temp_4: (response.data.list[32].main.temp - 273.15).toFixed(0)
            }

            var weekday = 0;

            for (let i=0; i < 33; i+7) {
                var data = new Date(response.data.list[i].dt_txt);
                weekDay  = data.getDay();
                console.log(weekDay)
            }

            if(weekday == 1){
                $scope.cidade.diaSemana = "Segunda-feira"
            } else if(weekday == 2){
                $scope.cidade.diaSemana = "Terça-feira"
            } else if(weekday == 3){
                $scope.cidade.diaSemana = "Quarta-feira"
            } else if(weekday == 4){
                $scope.cidade.diaSemana = "Quinta-feira"
            } else if(weekday == 5){
                $scope.cidade.diaSemana = "Sexta-feira"
            } else if(weekday == 6){
                $scope.cidade.diaSemana = "Sábado"
            } else if(weekday == 7){
                $scope.cidade.diaSemana = "Domingo"
            }
            console.log($scope.cidade)
        })
    }

});
