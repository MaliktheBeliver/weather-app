const apiKey = '56c2127697d8de939f2f895374f52c4c'; // Replace with your OpenWeatherMap API key
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const cityElement = document.getElementById('city');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const weatherIcon = document.getElementById('weather-icon');

async function getWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        
        if (response.ok) {
            updateWeatherUI(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

// Add these new constants at the top with other DOM elements
const windDirectionElement = document.getElementById('wind-direction');
const feelsLikeElement = document.getElementById('feels-like');
const pressureElement = document.getElementById('pressure');
const visibilityElement = document.getElementById('visibility');

function updateWeatherUI(data) {
    // Existing updates
    cityElement.textContent = data.name;
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${Math.round(data.wind.speed)} km/h`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // New weather details
    // Convert wind direction from degrees to cardinal directions
    const windDegree = data.wind.deg;
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((windDegree %= 360) < 0 ? windDegree + 360 : windDegree) / 22.5) % 16;
    windDirectionElement.textContent = directions[index];

    // Additional weather information
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressureElement.textContent = `${data.main.pressure} hPa`;
    visibilityElement.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    // Add sunrise and sunset times if you want them
    if (data.sys.sunrise && data.sys.sunset) {
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        // You can add these to your UI if you create elements for them
    }
}

searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

async function getWeatherDataByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        
        if (response.ok) {
            updateWeatherUI(data);
        } else {
            alert('Unable to fetch weather data. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherDataByCoords(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                getWeatherData('London'); // Fallback to London if location access is denied
            }
        );
    } else {
        getWeatherData('Imphal'); // Fallback for browsers that don't support geolocation
    }
}

// Replace the last line of the file:
getCurrentLocation(); // Load weather for current location instead of London