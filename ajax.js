
// fonction permettant de créer d'un requete HTTP en fonction du navigateur

Xhr = () => {
    var obj = null;
    try {
        obj = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (Error) {
        try {
            obj = new ActiveXObject("MSXML2.XMLHTTP");
        } catch (Error) {
            try {
                obj = new XMLHttpRequest();
            } catch (Error) {
                alert(' Impossible de créer l\'objet XMLHttpRequest')
            }
        }
    }
    return obj;
};


function displayCommunes(){
    let input = document.getElementsByTagName('input')[0]

    // écouteur sur l'écriture dans le champs input
    input.onkeyup = ()=>{autoComplete(input)}

    // écouteur sur la validation du choix de la ville
    input.onchange = ()=>{displayWeather(input)}

}

autoComplete=(valInput)=>{
    let value = valInput.value
    let req = Xhr()
    req.onreadystatechange = function(){
        if(this.readyState == this.DONE){
            if(this.status == 200){
                makeListCommunes(this);
            }
            else{
                throw new Error('impossible de charger les communes')
            }
        }
    }

    req.open("GET","communes.php?nomCommune="+value+"&cache="+new Date().getTime(), true);
    req.send(null)
}

makeListCommunes = (r)=>{
    let data = r.responseXML
    let liste = document.getElementsByTagName('datalist')[0]
    liste.innerHTML="";

    let oOptions = data.getElementsByTagName('ville')

    for(let i = 0; i<oOptions.length; i++){
        let nomVille = document.createTextNode(oOptions[i].textContent)

        let element = document.createElement('option')

        element.value=oOptions[i].getAttribute('value')

        element.appendChild(nomVille)
        liste.appendChild(element)
    }
}

// chargement des communes
onload=displayCommunes

displayWeather=(ville)=>{

    let villeValue = ville.value.split(' ').join('-') // Pour les villes composé, dans la base de données le séparateur est un espace (on le remplace par un -)
    console.log(villeValue)

    let regChiffre = new RegExp('[0-9]')

    if (regChiffre.test(villeValue)){
        villeValue = villeValue.split('-').splice(0,1)
        console.log(villeValue)
    }

    let zoneInfo = document.getElementsByClassName('info')[0]
    zoneInfo.innerHTML = "";

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${villeValue},fr&units=metric&appid=f8668c5a4eda974bc5db4a1ec14922a0`)
        .then((response)=>{
            console.log('ok la requete est terminé')
            console.log(response)
            // Si le fichier n'a pas pu être chargé :
                if(!response.ok){
                    throw new Error('HTTP error,status ='+response.status)
                }
                // si le fichier a été récupéré
            return response.json()
        })
        .then(function(myJson){
            console.log('ok Json récupéré')

            // Div ou on ajoute les données
            let divMainInfo = document.getElementsByClassName('info')[0]

            // Données date du jour
            let pDay = document.createElement('p')
            let DateAjd = document.createTextNode(` heure : ${new Date()}`)
            pDay.appendChild(DateAjd)
            divMainInfo.appendChild(pDay)

            let pNomVille = document.createElement('p')
            let NomVille = document.createTextNode(`${myJson.name}, ${myJson.sys.country}`)
            pNomVille.appendChild(NomVille)
            divMainInfo.appendChild(pNomVille)

            /*************************************************************************************************
             *                      Début Témpératures :
             ************************************************************************************************/

            let pTempAct = document.createElement('p')
            pTempAct.className = "temp"
            let tempeAct = document.createTextNode(`Température actuelle : ${myJson.main.temp} °C`)
            pTempAct.appendChild(tempeAct)
            divMainInfo.appendChild(pTempAct)

            let pTempRess = document.createElement('p')
            pTempRess.className = "temp"
            let tempRess = document.createTextNode(`Température ressentie : ${myJson.main.feels_like} °C`)
            pTempRess.appendChild(tempRess)
            divMainInfo.appendChild(pTempRess)

            let pTepmMin = document.createElement('p')
            pTepmMin.className = "temp"
            let tempMin = document.createTextNode(`Température minimale : ${myJson.main.temp_min} °C `)
            pTepmMin.appendChild(tempMin)
            divMainInfo.appendChild(pTepmMin)

            let pTempMax = document.createElement('p')
            pTempMax.className = "temp"
            let tempMax = document.createTextNode(`Températures maximale : ${myJson.main.temp_max} °C `)
            pTempMax.appendChild(tempMax)
            divMainInfo.appendChild(pTempMax)

            let pPression = document.createElement('p')
            pPression.className = "temp"
            let pression = document.createTextNode(`Pression : ${myJson.main.pressure} hPa`)
            pPression.appendChild(pression)
            divMainInfo.appendChild(pPression)

            let pHumi = document.createElement('p')
            pHumi.className = "temp"
            let Humi = document.createTextNode(`Humitidé : ${myJson.main.humidity} %`)

            /*************************************************************************************************
             *                      Fin Témpératures :
             ************************************************************************************************/

            let pMeteo = document.createElement('p')
            let Meteo = document.createTextNode(`Description du temps actuel: ${myJson.weather[0].description}`)
            pMeteo.appendChild(Meteo)
            divMainInfo.appendChild(pMeteo)

            let pVent = document.createElement('p')
            let vent = document.createTextNode(`Vitesse du vent : ${myJson.wind.speed} neuds`)
            pVent.appendChild(vent)
            divMainInfo.appendChild(pVent)

            // Affichage de la carte en fonction des coordonées de la ville récupéré par l'API
            displayMap(myJson.coord.lat, myJson.coord.lon)

        })
        .catch(function(error){
            console.log('Erreur requête impossible')
            console.log(error)
        })
}

function displayMap(lat, long){
    carte.setView([lat,long],10);
    marker = L.marker([lat,long]).addTo(carte)
    circle = L.circle([lat,long],{
        color:'green',
        fill:'white',
        fillOpacity:0.5,
        radius:20000
    }).addTo(carte)

}