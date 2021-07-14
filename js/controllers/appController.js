angular.module("appWeather").controller("appController", function($scope, weatherService, $q) {

    $scope.showButtonCard = true;
    $scope.showCidades = true;
    $scope.showSinglecity = false;
    $scope.showInfoCity = false;
    $scope.showLoading = false;

    //definindo cidades da tela principal
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

    //array de promisses para o callback posterior
    var promisses = [];

    //Array de cidades da tela principal
    $scope.cidades = [];
    
    //monta o array de cidades da tela principal do app
    for(let i = 0 ; i < cidades.length; i++){    
        $scope.showCidades = false;
        $scope.showLoading = true;
           
        var promisse = weatherService.findWeatherCity(cidades[i]).then((response) => {  
            console.log(response.data) 

            //monta o objeto de cidade da tela principal
            var cidade = {
                id: response.data.id,
                icon:  "assets/icons/" + response.data.weather[0].icon + ".png",
                backgrounds: "assets/backgrounds/" + response.data.weather[0].icon + ".jpg",
                nome : response.data.name,
                temp: (response.data.main.temp - 273.15).toFixed(0),
                temp_max : (response.data.main.temp_max - 273.15).toFixed(0),
                temp_min : (response.data.main.temp_min - 273.15).toFixed(0),
                temp_feels_like : (response.data.main.feels_like - 273.15).toFixed(0)
            }
            return cidade;
        })
        //adiciona no array de promisses cada cidade encontrada
        promisses.push(promisse);
    } 


    //faz todas as promisses referentes ao array
    $q.all(promisses).then(function(results){
        $scope.showLoading = true;
        $scope.cidades = results;
        $scope.showLoading = false;
        $scope.showCidades = true;
        console.log(results)
    }) 
    
    //carrega apenas a cidade selecionada
    $scope.loadSingle = (nome) => {
        weatherService.findWeatherCity(nome).then((response) => {
            //montar mapa segundo API
            var map = new ol.Map({
                target: 'map',
                layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
                ],
                view: new ol.View({
                center: ol.proj.fromLonLat([response.data.coord.lon, response.data.coord.lat]),
                zoom : 11.9
                })
            });

            //montar objeto da cidade
            $scope.cidade = {
                id: response.data.id,
                icon:  "assets/icons/" + response.data.weather[0].icon + ".png",
                backgrounds: "assets/backgrounds/" + response.data.weather[0].icon + "large.jpg",
                nome : response.data.name,
                temp: (response.data.main.temp - 273.15).toFixed(0),
                temp_max : (response.data.main.temp_max - 273.15).toFixed(0),
                temp_min : (response.data.main.temp_min - 273.15).toFixed(0),
                temp_feels_like : (response.data.main.feels_like - 273.15).toFixed(0),
                wind : (response.data.wind.speed * 3.6).toFixed(0),
                humidity : response.data.main.humidity,
                pressure : response.data.main.pressure,
                mapa : map
            }
            console.log($scope.cidade.backgrounds);
        }).catch((error) => {
            alert("Cidade não encontrada")
            location.reload();
        })
    }

    $scope.loadSingleByCoords = (lat, lon) => {
        weatherService.findByCoords(lat, lon).then((response) => {
            //montar mapa segundo API
            var map = new ol.Map({
                target: 'map',
                layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
                ],
                view: new ol.View({
                center: ol.proj.fromLonLat([response.data.coord.lon, response.data.coord.lat]),
                zoom : 11.9
                })
            });

            //montar objeto da cidade
            $scope.cidade = {
                id: response.data.id,
                icon:  "assets/icons/" + response.data.weather[0].icon + ".png",
                backgrounds: "assets/backgrounds/" + response.data.weather[0].icon + "large.jpg",
                nome : response.data.name,
                temp: (response.data.main.temp - 273.15).toFixed(0),
                temp_max : (response.data.main.temp_max - 273.15).toFixed(0),
                temp_min : (response.data.main.temp_min - 273.15).toFixed(0),
                temp_feels_like : (response.data.main.feels_like - 273.15).toFixed(0),
                wind : (response.data.wind.speed * 3.6).toFixed(0),
                humidity : response.data.main.humidity,
                pressure : response.data.main.pressure,
                mapa : map

            }
            console.log($scope.cidade);
        }).catch((error) => {
            alert("Cidade não encontrada")
            location.reload();
        })
    }

    //buscar cidade pelo input de pesquisa
    $scope.buscarCidade = (cidadeNome) => {
        $scope.showCidades = false;
        var input = document.querySelector("#search-cidade");
        var cidadeNome = input.value; 
        $scope.loadSingle(cidadeNome);
        input.value = "";
        $scope.showSinglecity = true;
    }

    //ver informações de uma cidade já cadastrada
    $scope.infoCidade = (nome) => {
        $scope.showCidades = false;
        $scope.showSinglecity = false;
        $scope.showInfoCity = true;
        $scope.loadSingle(nome);
    }

    //botão de retornar a tela pincipal
    $scope.mostrarCidades = () => {
        location.reload();
        $scopw.showLoading = true;
        $scope.showSinglecity = false;
        $scope.showInfoCity = false;
        $scope.showCidades = true;
        $scope.cidade = {};
    }

    //busca as cidades via geolocalização
    $scope.buscarCidadeAtual = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((response) => {
                $scope.showCidades = false;
                $scope.showSinglecity = false;
                $scope.showInfoCity = true;
                $scope.loadSingleByCoords(response.coords.latitude,response.coords.longitude);
            });
        } else{
            alert("Não foi possível definir a localização")
        }
    }
});
