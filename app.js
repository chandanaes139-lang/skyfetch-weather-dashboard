const API_KEY = 'bc9999f694eb8d8dd34a391e8f671a23';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

function WeatherApp(apiKey) {
    this.apiKey = apiKey;

    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');
    this.recentSearchesContainer = document.getElementById('recent-searches-container');

    this.recentSearches = [];
    this.maxRecentSearches = 5;

    this.init();
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener('click', () => this.handleSearch());

    this.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSearch();
    });

    document.getElementById('clear-history-btn')?.addEventListener('click', () => this.clearHistory());

    this.loadRecentSearches();
    this.loadLastCity();
    this.showWelcome();
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city || city.length < 2) {
        this.showError('Enter a valid city name');
        return;
    }

    this.getWeather(city);
    this.cityInput.value = '';
};

WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = '<div class="loading"><p>⏳ Loading...</p></div>';
};

WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `<div class="error">⚠️ ${message}</div>`;
};

WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="welcome">
            <h2>🌤️ Weather Dashboard</h2>
            <p>Enter a city name</p>
        </div>
    `;
};

WeatherApp.prototype.getWeather = async function (city) {
    this.showLoading();
    this.searchBtn.disabled = true;

    try {
        const encodedCity = encodeURIComponent(city);

        const [weatherRes, forecastRes] = await Promise.all([
            axios.get(`${API_URL}?q=${encodedCity}&appid=${this.apiKey}&units=metric`),
            axios.get(`${FORECAST_URL}?q=${encodedCity}&appid=${this.apiKey}&units=metric`)
        ]);

        this.displayWeather(weatherRes.data);
        this.displayForecast(forecastRes.data);

        this.saveRecentSearch(city);
        localStorage.setItem('lastCity', city);

    } catch (error) {
        const msg =
            error.response?.data?.message ||
            (error.response?.status === 404 ? 'City not found' : 'Something went wrong');

        this.showError(msg);
    } finally {
        this.searchBtn.disabled = false;
    }
};

WeatherApp.prototype.displayWeather = function (data) {
    const { name, main, weather, wind, clouds, visibility } = data;

    this.weatherDisplay.innerHTML = `
        <div class="weather-card">
            <h2>${name}</h2>
            <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png"/>
            <h1>${Math.round(main.temp)}°C</h1>
            <p>${weather[0].description}</p>

            <div class="details">
                <p>💨 Wind: ${wind.speed} m/s</p>
                <p>💧 Humidity: ${main.humidity}%</p>
                <p>👁️ Visibility: ${(visibility / 1000 || 0).toFixed(1)} km</p>
                <p>☁️ Clouds: ${clouds.all}%</p>
            </div>
        </div>
    `;
};

WeatherApp.prototype.displayForecast = function (data) {
    const days = data.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 5);

    const forecastHTML = days.map(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short'
        });

        return `
            <div class="forecast-card">
                <h4>${date}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/>
                <p>${Math.round(day.main.temp)}°C</p>
            </div>
        `;
    }).join('');

    this.weatherDisplay.innerHTML += `
        <div class="forecast">
            <h3>5-Day Forecast</h3>
            <div class="forecast-grid">${forecastHTML}</div>
        </div>
    `;
};

WeatherApp.prototype.saveRecentSearch = function (city) {
    const formatted = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    this.recentSearches = this.recentSearches.filter(c => c !== formatted);
    this.recentSearches.unshift(formatted);

    if (this.recentSearches.length > this.maxRecentSearches) {
        this.recentSearches.pop();
    }

    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
    this.recentSearchesContainer.innerHTML = '';

    this.recentSearches.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'recent-btn';
        btn.textContent = city;

        btn.addEventListener('click', () => {
            this.cityInput.value = city;
            this.getWeather(city);
        });

        this.recentSearchesContainer.appendChild(btn);
    });
};

WeatherApp.prototype.loadRecentSearches = function () {
    this.recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    this.displayRecentSearches();
};

WeatherApp.prototype.loadLastCity = function () {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) this.getWeather(lastCity);
};

WeatherApp.prototype.clearHistory = function () {
    this.recentSearches = [];
    localStorage.removeItem('recentSearches');
    this.displayRecentSearches();
};

const app = new WeatherApp(API_KEY);