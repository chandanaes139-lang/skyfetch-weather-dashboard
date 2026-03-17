
const API_KEY = 'bc9999f694eb8d8dd34a391e8f671a23';  // Replace with your actual API key
const API_URL = ' https://api.openweathermap.org/data/2.5/weather?q=London&appid=bc9999f694eb8d8dd34a391e8f671a23&units=metric';

function WeatherApp(apiKey) {
    // Store API config
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // Store DOM elements
    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');

    // Initialize app
    this.init();
}
WeatherApp.prototype.init = function () {
    // Button click
    this.searchBtn.addEventListener(
        'click',
        this.handleSearch.bind(this)
    );

    // Enter key press
    this.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    });

    // Show welcome screen
    this.showWelcome();
};
WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <h2>🌤️ Weather Dashboard</h2>
            <p>Enter a city to get current weather and forecast</p>
        </div>
    `;
};
WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError('Please enter a city name');
        return;
    }

    if (city.length < 2) {
        this.showError('City name too short');
        return;
    }

    this.getWeather(city);

    this.cityInput.value = '';
};
WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `
        <div class="loading-container">
            <p>⏳ Loading weather...</p>
        </div>
    `;
};
WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
};
WeatherApp.prototype.getWeather = async function (city) {
    this.showLoading();

    this.searchBtn.disabled = true;
    this.searchBtn.textContent = 'Searching...';

    const weatherUrl = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
        const [weatherRes, forecastData] = await Promise.all([
            axios.get(weatherUrl),
            this.getForecast(city)
        ]);

        this.displayWeather(weatherRes.data);
        this.displayForecast(forecastData);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            this.showError('City not found');
        } else {
            this.showError('Something went wrong');
        }
    } finally {
        this.searchBtn.disabled = false;
        this.searchBtn.textContent = 'Search';
    }
};
WeatherApp.prototype.getForecast = async function (city) {
    const url = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        throw error;
    }
};
WeatherApp.prototype.processForecastData = function (data) {
    const filtered = data.list.filter(item =>
        item.dt_txt.includes('12:00:00')
    );

    return filtered.slice(0, 5);
};
WeatherApp.prototype.displayWeather = function (data) {
    const city = data.name;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    this.weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2>${city}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png"/>
            <h1>${temp}°C</h1>
            <p>${desc}</p>
        </div>
    `;
};
WeatherApp.prototype.displayForecast = function (data) {
    const days = this.processForecastData(data);

    const forecastHTML = days.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const temp = Math.round(day.main.temp);
        const desc = day.weather[0].description;
        const icon = day.weather[0].icon;

        return `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png"/>
                <p>${temp}°C</p>
                <p>${desc}</p>
            </div>
        `;
    }).join('');

    this.weatherDisplay.innerHTML += `
        <div class="forecast-section">
            <h3>5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastHTML}
            </div>
        </div>
    `;
};
// Function to fetch weather data
function getWeather(city) {
    // Build the complete URL
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    
    // Make API call using Axios
    axios.get(url)
        .then(function(response) {
            // Success! We got the data
            console.log('Weather Data:', response.data);
            displayWeather(response.data);
        })
        .catch(function(error) {
            // Something went wrong
            console.error('Error fetching weather:', error);
            document.getElementById('weather-display').innerHTML = 
                '<p class="loading">Could not fetch weather data. Please try again.</p>';
        });
}
    async function getWeather(city) {
      const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

      try {
         const response = await axios.get(url);

         console.log(response.data);

         displayWeather(response.data);

    } catch (error) {
        console.error(error);
        showError("Something went wrong!");
    }
}
 function showError(message) {
    const weatherDiv = document.getElementById("weather-display");

    weatherDiv.innerHTML = `
        <div class="error-message">
            ❌ ${message}
        </div>
    `;
}
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();
    searchBtn.disabled = true;

    if (!city) {
        showError("Please enter a city name");
        return;
    }

    getWeather(city);
});
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
 
});
  

// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    document.getElementById('weather-display').innerHTML = weatherHTML;
}

// Call the function when page loads
 document.getElementById("weather-display").innerHTML = `
    <p>🌍 Enter a city to get weather info</p>
`;
function showLoading() {
    const weatherDiv = document.getElementById("weather-display");

    weatherDiv.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
}
async function getWeather(city) {
    showLoading();

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);

        displayWeather(response.data);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            showError("City not found!");
        } else {
            showError("Something went wrong!");
        }
    }
}