async function fetchWeatherBogota() {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=4.7110&lon=-74.0721&appid=37103ed20722fac4aa92ca8315f53307&units=metric');
    const data = await response.json();
    displayWeather(data, 'bogota');
}

async function fetchWeatherMedellin() {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=6.2442&lon=-75.5812&appid=37103ed20722fac4aa92ca8315f53307&units=metric');
    const data = await response.json();
    displayWeather(data, 'medellin');
}

async function fetchWeatherCartagena() {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=10.3910&lon=-75.4794&appid=37103ed20722fac4aa92ca8315f53307&units=metric');
    const data = await response.json();
    displayWeather(data, 'cartagena');
}

function displayWeather(data, city) {
    const cityNames = {
        'medellin': 'Medellín',
        'bogota': 'Bogotá',
        'cartagena': 'Cartagena'
    };

    const cityName = cityNames[city] || data.name;
    const temp = Math.round(data.main.temp);
    const tempMax = Math.round(data.main.temp_max);
    const tempMin = Math.round(data.main.temp_min);
    const feelsLike = Math.round(data.main.feels_like);

    // Create or get the weather container for this city
    let weatherDiv = document.getElementById(`weather-${city}`);
    if (!weatherDiv) {
        // Create container if it doesn't exist
        const weatherSection = document.getElementById('current-weather');
        weatherDiv = document.createElement('div');
        weatherDiv.id = `weather-${city}`;
        weatherDiv.className = 'city-weather';
        weatherSection.appendChild(weatherDiv);
    }

    weatherDiv.innerHTML = `
        <div class="weather-card">
            <h3>${cityName}</h3>
            <div class="weather-info">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
                <div class="temperature-info">
                    <p class="current-temp">${temp}°C</p>
                    <p class="weather-desc">${data.weather[0].main}</p>
                    <p class="feels-like">Feels like ${feelsLike}°C</p>
                </div>
                <div class="temp-range">
                    <p class="high-low">H: ${tempMax}°C | L: ${tempMin}°C</p>
                    <p class="humidity">Humidity: ${data.main.humidity}%</p>
                </div>
            </div>
        </div>
    `;
}
// Initialize weather display
function initWeather() {
    // Add a header to the weather section
    const weatherSection = document.getElementById('current-weather');
    if (!weatherSection) {
        console.error('Weather section not found');
        return;
    }
    // Fetch weather for all three cities

    fetchWeatherMedellin();
    fetchWeatherBogota();
    fetchWeatherCartagena();
}

// Start the weather display
initWeather();