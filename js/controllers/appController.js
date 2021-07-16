angular.module("appWeather").controller("appController", function($scope, weatherService, $q) {

    $scope.showButtonCard = true;
    $scope.showCidades = false;
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

    //definindo dias da semana 
    var diaSemana = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"
    ]


    //array de promisses para o callback posterior
    var promisses = [];
    var promisseDiaSemana = [];

    //Arrays
    $scope.cidades = [];
    $scope.previsaoDiaSemana = [];

    //monta o mapa de localizao segundo padrão da API
    this.buildMap = (long, lat) => {
        var map = new ol.Map({
            target: 'map',
            layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
            ],
            view: new ol.View({
            center: ol.proj.fromLonLat([long, lat]),
            zoom : 11.9
            })
        });

        //Adiciona um pin na localização em específico
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
                    })
                ]
            })
        });
        map.addLayer(layer);
    }

    //carrega a previsão da semana 
    this.buildWeekPrevision = (res, i) => {

        var dataFormatada = new Date((res.data.daily[i].dt)*1000).getDay();
        var dia = diaSemana[dataFormatada]; 

        var previsaoSemana = {
            humidity: res.data.daily[i].humidity,
            pressure: res.data.daily[i].pressure,
            background : "assets/backgrounds/" + res.data.daily[i].weather[0].icon + "large.jpg",
            temp_day : (res.data.daily[i].temp.day - 273.15).toFixed(0),
            temp_evening : (res.data.daily[i].temp.eve - 273.15).toFixed(0),
            temp_max : (res.data.daily[i].temp.max - 273.15).toFixed(0),
            temp_min : (res.data.daily[i].temp.min - 273.15).toFixed(0),
            temp_night : (res.data.daily[i].temp.night - 273.15).toFixed(0),
            icon : "assets/icons/" + res.data.daily[i].weather[0].icon + ".png",
            wind_speed : (res.data.daily[i].wind_speed * 3.6).toFixed(0),
            nome_dia: dia
        }

        return previsaoSemana;
    }
    
    //carrega os dados iniciais da aplicação
    $scope.loadData = () => {
        //monta o array de cidades da tela principal do app
        for(let i = 0 ; i < cidades.length; i++){    
            $scope.showCidades = false;
            $scope.showLoading = true;
            
            var promisse = weatherService.findWeatherCity(cidades[i]).then((response) => { 

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
        })
    }
       
    //carrega apenas a cidade selecionada
    $scope.loadSingle = (nome) => {
        weatherService.findWeatherCity(nome).then((response) => {
            
            promisseDiaSemana = [];

            this.buildMap(response.data.coord.lon, response.data.coord.lat);
           
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
            }

          
            for(let i = 1 ; i < diaSemana.length; i++){    
                
                var promisse = weatherService.findFurther(response.data.coord.lat, response.data.coord.lon).then((res) => {
                    
                   var previsaoSemana = this.buildWeekPrevision(res, i);

                   return previsaoSemana

                })
                //adiciona no array de promisses cada dia da semana
                promisseDiaSemana.push(promisse);
                
            }

            $q.all(promisseDiaSemana).then(function(results){
                $scope.cidade.previsaoSemana = results;     
                console.log($scope.cidade)
            })
        }).catch((error) => {
            alert(error)
            location.reload();
        })
    }

    //carrega as cidades de acordo com a localização atual
    $scope.loadSingleByCoords = (lat, lon) => {
        weatherService.findByCoords(lat, lon).then((response) => {

            this.buildMap(response.data.coord.lon, response.data.coord.lat);
            
            $scope.showLoading = true;
            $scope.showInfoCity = true;
            

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
            }
            
            for(let i = 1 ; i < diaSemana.length; i++){    
                
                var promisse = weatherService.findFurther(response.data.coord.lat, response.data.coord.lon).then((res) => {
                    
                    var previsaoSemana = this.buildWeekPrevision(res, i);
    
                    return previsaoSemana
                })
                //adiciona no array de promisses cada dia da semana
                promisseDiaSemana.push(promisse);
                
            }

            $q.all(promisseDiaSemana).then(function(results){
                $scope.cidade.previsaoSemana = results;     
                console.log($scope.cidade)
                $scope.showLoading = false;
            })
           
            //montar mapa segundo API
            
            
        }).catch((error) => {
            alert("Cidade não encontrada")
            location.reload();
        })
    }

    //buscar cidade pelo input de pesquisa
    $scope.buscarCidade = (cidadeNome) => {
        $scope.showInfoCity = false;
        var input = document.querySelector("#search-cidade");
        var cidadeNome = input.value; 
        $scope.loadSingle(cidadeNome);
        input.value = "";
        $scope.showSearchedCity = true;
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
        $scope.showSinglecity = false;
        $scope.showInfoCity = false;
        $scope.loadData();
        $scope.showCidades = true;
        $scope.cidade = {};
    }

    $scope.backPage = () => {
        $scope.showSearchedCity = false;
        $scope.showInfoCity = true;
    }

    $scope.refreshPage = () => {
        location.reload();
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

    $scope.buscarCidadeAtual();
});
