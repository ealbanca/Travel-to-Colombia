async function fetchWeather() {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=4.709870457379291&lon=-74.058197&appid=37103ed20722fac4aa92ca8315f53307&units=metric');
    const data = await response.json();
    displayWeather(data);
}

async function fetchForecast() {
    const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?lat=4.709870457379291&lon=-74.058197&appid=37103ed20722fac4aa92ca8315f53307&units=metric');
    const data = await response.json();

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Filter forecasts for tomorrow
    const tomorrowForecasts = data.list.filter(forecast =>
        forecast.dt_txt.startsWith(tomorrowDate)
    );

    // Find the highest temperature and corresponding weather data
    let maxTemp = -Infinity;
    let maxTempForecast = null;

    tomorrowForecasts.forEach(forecast => {
        if (forecast.main.temp_max > maxTemp) {
            maxTemp = forecast.main.temp_max;
            maxTempForecast = forecast;
        }
    });

    displayForecast(maxTempForecast, maxTemp);
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('current-weather');
    const temp = Math.round(data.main.temp);
    weatherDiv.innerHTML = `
        <h2>Today's Weather</h2>
        <div class="current-weather">
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p>${data.weather[0].main} (${data.weather[0].description}) ${temp}°C</p>
        </div>
    `;

    // Display high temperature in the banner
    const banner = document.getElementById('high-temp-message');
    const tempMax = Math.round(data.main.temp_max);
    banner.textContent = `The highest temperature for today is ${tempMax}°C.`;

}

function displayForecast(data, maxTemp) {
    const forecastDiv = document.getElementById('forecast-weather');

    if (!data) {
        forecastDiv.innerHTML = `
            <h2>Tomorrow's Weather</h2>
            <p>Forecast data not available</p>
        `;
        return;
    }

    const highTemp = Math.round(maxTemp);
    const time = new Date(data.dt * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    forecastDiv.innerHTML = `
        <h2>Tomorrow's Weather</h2>
        <div class="forecast-weather">
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p>Tomorrow's High temperature at ${time}: ${highTemp}°C <span class="forecast-details">${data.weather[0].main} (${data.weather[0].description})</span>
        </div>
    `;
}

fetchWeather();
fetchForecast();