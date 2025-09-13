// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loadingDiv = document.getElementById('loading');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMessage = document.getElementById('errorMessage');

// Weather display elements
const cityName = document.getElementById('cityName');
const currentTime = document.getElementById('currentTime');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDesc = document.getElementById('weatherDesc');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const errorText = document.getElementById('errorText');

// Weather icon mapping
const weatherIcons = {
    'clear': '☀️',
    'sunny': '☀️',
    'partly cloudy': '⛅',
    'cloudy': '☁️',
    'overcast': '☁️',
    'light rain': '🌦️',
    'rain': '🌧️',
    'heavy rain': '⛈️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'light snow': '🌨️',
    'heavy snow': '❄️',
    'fog': '🌫️',
    'mist': '🌫️',
    'drizzle': '🌦️',
    'default': '🌤️'
};

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize with default city
window.addEventListener('load', function() {
    cityInput.value = 'London';
    handleSearch();
});

// This function is replaced by the enhanced version below

async function fetchWeatherData(city) {
    try {
        // Using wttr.in API - completely free, no API key required
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
            method: 'GET',
            headers: {
                'User-Agent': 'WeatherApp/1.0'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.current_condition || !data.current_condition[0]) {
            throw new Error('Invalid weather data received');
        }
        
        displayWeatherData(data, city);
        
    } catch (error) {
        console.error('Fetch error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Unable to connect to weather service. Please check your internet connection.');
        } else if (error.message.includes('404') || error.message.includes('400')) {
            showError(`City "${city}" not found. Please check the spelling and try again.`);
        } else {
            showError('Unable to fetch weather data. Please try again later.');
        }
    }
}

function displayWeatherData(data, searchedCity) {
    try {
        const current = data.current_condition[0];
        const location = data.nearest_area[0];
        
        // Display city name
        const displayName = location.areaName[0].value;
        const country = location.country[0].value;
        cityName.textContent = `${displayName}, ${country}`;
        
        // Display current time
        const now = new Date();
        currentTime.textContent = now.toLocaleDateString() + ' • ' + now.toLocaleTimeString();
        
        // Display temperature
        temperature.textContent = current.temp_C;
        
        // Display weather description and icon
        const desc = current.weatherDesc[0].value.toLowerCase();
        weatherDesc.textContent = current.weatherDesc[0].value;
        
        // Set appropriate weather icon
        const icon = getWeatherIcon(desc);
        weatherIcon.textContent = icon;
        
        // Display additional weather details
        feelsLike.textContent = `${current.FeelsLikeC}°C`;
        humidity.textContent = `${current.humidity}%`;
        windSpeed.textContent = `${current.windspeedKmph} km/h`;
        pressure.textContent = `${current.pressure} mb`;
        
        // Hide loading and show weather display
        hideLoading();
        showWeatherDisplay();
        
    } catch (error) {
        console.error('Error displaying weather data:', error);
        showError('Error displaying weather information. Please try again.');
    }
}

function getWeatherIcon(description) {
    // Convert description to lowercase for matching
    const desc = description.toLowerCase();
    
    // Check for specific weather conditions
    if (desc.includes('clear') || desc.includes('sunny')) {
        return weatherIcons.sunny;
    } else if (desc.includes('partly cloudy') || desc.includes('partly')) {
        return weatherIcons['partly cloudy'];
    } else if (desc.includes('cloudy') || desc.includes('overcast')) {
        return weatherIcons.cloudy;
    } else if (desc.includes('thunder') || desc.includes('storm')) {
        return weatherIcons.thunderstorm;
    } else if (desc.includes('heavy rain') || desc.includes('downpour')) {
        return weatherIcons['heavy rain'];
    } else if (desc.includes('rain') || desc.includes('shower')) {
        return weatherIcons.rain;
    } else if (desc.includes('drizzle') || desc.includes('light rain')) {
        return weatherIcons.drizzle;
    } else if (desc.includes('heavy snow') || desc.includes('blizzard')) {
        return weatherIcons['heavy snow'];
    } else if (desc.includes('snow') || desc.includes('sleet')) {
        return weatherIcons.snow;
    } else if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
        return weatherIcons.fog;
    }
    
    return weatherIcons.default;
}

function showLoading() {
    loadingDiv.style.display = 'block';
}

function hideLoading() {
    loadingDiv.style.display = 'none';
}

function showWeatherDisplay() {
    weatherDisplay.style.display = 'block';
}

function hideWeatherDisplay() {
    weatherDisplay.style.display = 'none';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    hideLoading();
}

function hideError() {
    errorMessage.style.display = 'none';
}

function hideAllDisplays() {
    hideLoading();
    hideWeatherDisplay();
    hideError();
}

// Input validation
function validateCityName(city) {
    // Remove leading/trailing spaces
    city = city.trim();
    
    // Check if empty
    if (!city) {
        return { valid: false, message: 'Please enter a city name' };
    }
    
    // Check minimum length
    if (city.length < 2) {
        return { valid: false, message: 'City name must be at least 2 characters long' };
    }
    
    // Check maximum length
    if (city.length > 50) {
        return { valid: false, message: 'City name is too long' };
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const validPattern = /^[a-zA-Z\s\-'\.]+$/;
    if (!validPattern.test(city)) {
        return { valid: false, message: 'City name contains invalid characters' };
    }
    
    return { valid: true, message: '' };
}

// Enhanced search with validation
async function handleSearch() {
    const city = cityInput.value.trim();
    
    // Validate input
    const validation = validateCityName(city);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }
    
    // Clear previous results
    hideAllDisplays();
    showLoading();
    
    try {
        await fetchWeatherData(city);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Failed to fetch weather data. Please try again.');
    }
}

// Add some helpful features
document.addEventListener('DOMContentLoaded', function() {
    // Focus on input when page loads
    cityInput.focus();
    
    // Add placeholder animation
    let placeholderIndex = 0;
    const placeholders = [
        'Enter city name (e.g., London, Tokyo, New York)',
        'Try: Paris, France',
        'Try: Sydney, Australia',
        'Try: Cairo, Egypt',
        'Try: Mumbai, India'
    ];
    
    setInterval(function() {
        if (!cityInput.value && document.activeElement !== cityInput) {
            cityInput.placeholder = placeholders[placeholderIndex];
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        }
    }, 3000);
});