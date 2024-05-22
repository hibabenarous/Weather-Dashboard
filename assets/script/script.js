const API_KEY = '7d1b285353ccacd5326159e04cfab063';

function getResult() {
    let cityCode = document.getElementById('myInput').value;
    let countryCode = 'TN'; // Tunisia country code
    let geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityCode},${countryCode}&limit=5&appid=${API_KEY}`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                let geoLon = data[0].lon;
                let geoLat = data[0].lat;

                let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${geoLat}&lon=${geoLon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`;
                
                return fetch(weatherUrl);
            } else {
                throw new Error('City not found');
            }
        })
        .then(response => response.json())
        .then(data => {
            let weatherIcon = data.current.weather[0].icon;
            let imgSrc = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
            document.getElementById('weatherIcon').src = imgSrc;
            
            document.getElementById('cityName').textContent = cityCode;

            let date = new Date(data.current.dt * 1000);
            document.getElementById('dateTime').textContent = `(${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()})`;

            document.getElementById('temp').textContent = `Temperature: ${data.current.temp} °C`;
            document.getElementById('humidity').textContent = `Humidity: ${data.current.humidity} %`;
            document.getElementById('wind').textContent = `Wind Speed: ${data.current.wind_speed} m/s`;

            addResult();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function addResult() {
    let inputCity = document.getElementById("myInput").value;
    let historyList = getInfo();
    let searchCity = document.createElement("div");
    searchCity.id = inputCity;
    searchCity.textContent = inputCity;
    searchCity.className = "h4";
    
    if (!historyList.includes(inputCity)) {
        document.querySelector(".history").appendChild(searchCity);
    }
    document.querySelector(".subtitle").style.display = "inline";
    addInfo(inputCity);
}

function getInfo() {
    // Implement a function to get search history from local storage or return an empty array if not available
    let history = localStorage.getItem('history');
    return history ? JSON.parse(history) : [];
}

function addInfo(city) {
    // Implement a function to save search history to local storage
    let history = getInfo();
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('history', JSON.stringify(history));
    }
}

document.querySelector(".history").addEventListener('click', function(event) {
    event.preventDefault();
    if (event.target && event.target.matches("div.h4")) {
        document.getElementById("myInput").value = event.target.id;
        getResult();
    }
});
