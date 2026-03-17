
const API_KEY = 'bc9999f694eb8d8dd34a391e8f671a23';  // Replace with your actual API key
const API_URL = ' https://api.openweathermap.org/data/2.5/weather?q=London&appid=bc9999f694eb8d8dd34a391e8f671a23&units=metric';

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