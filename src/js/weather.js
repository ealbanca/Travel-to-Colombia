async function fetchWeather() {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Cozumel&appid=ab520e4710bc7b1e7a9253788f49f215&units=metric');
    const data = await response.json();
    displayWeather(data);
}

async function fetchForecast() {
    const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?q=Cozumel&appid=ab520e4710bc7b1e7a9253788f49f215&units=metric');
    const data = await response.json();
    const forecast = data.list.find(forecast => forecast.dt_txt.endsWith("15:00:00"));
    displayForecast(forecast);
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('current-weather');
    const temp = Math.round(data.main.temp);
    weatherDiv.innerHTML = `
        <h2>Today's Weather</h2>
        <div class="current-weather">
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p>${data.weather[0].main} (${data.weather[0].description})</p>
        <p>${temp}°C</p>
        <p>${data.main.humidity}% Humidity</p>
        </div>
    `;

    // Display high temperature in the banner
    const banner = document.getElementById('high-temp-message');
    const tempMax = Math.round(data.main.temp_max);
    banner.textContent = `The highest temperature for today is ${tempMax}°C.`;

}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast-weather');
    const temp = Math.round(data.main.temp);
    forecastDiv.innerHTML = `
        <h2>Tomorrow's Weather</h2>
        <div class="forecast-weather">
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p>Tomorrow at 3:00 PM: ${temp}°C</p>
        </div>
    `;
}

fetchWeather();
fetchForecast();