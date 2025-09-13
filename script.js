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
        // Try OpenWeatherMap API first (free tier with API key)
        // If that fails, fall back to mock data for demonstration
        let data;
        
        try {
            // Using OpenWeatherMap free API
            const API_KEY = 'demo'; // For demo purposes, will fall back to mock data
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const apiData = await response.json();
            data = convertOpenWeatherMapData(apiData);
            
        } catch (apiError) {
            console.log('API failed, using mock data for demonstration:', apiError.message);
            // Fall back to mock data for testing
            data = getMockWeatherData(city);
        }
        
        displayWeatherData(data, city);
        
    } catch (error) {
        console.error('Fetch error:', error);
        showError('Unable to fetch weather data. Please try again later.');
    }
}

// Convert OpenWeatherMap API response to our format
function convertOpenWeatherMapData(apiData) {
    return {
        current_condition: [{
            temp_C: Math.round(apiData.main.temp),
            FeelsLikeC: Math.round(apiData.main.feels_like),
            humidity: apiData.main.humidity,
            pressure: apiData.main.pressure,
            windspeedKmph: Math.round(apiData.wind.speed * 3.6), // Convert m/s to km/h
            weatherDesc: [{ value: apiData.weather[0].description }]
        }],
        nearest_area: [{
            areaName: [{ value: apiData.name }],
            country: [{ value: apiData.sys.country }]
        }]
    };
}

// Mock data for testing when API is unavailable
function getMockWeatherData(city) {
    const mockData = {
        'london': {
            temp_C: '15',
            FeelsLikeC: '13',
            humidity: '78',
            pressure: '1013',
            windspeedKmph: '12',
            weatherDesc: 'Partly cloudy',
            areaName: 'London',
            country: 'United Kingdom'
        },
        'tokyo': {
            temp_C: '22',
            FeelsLikeC: '24',
            humidity: '65',
            pressure: '1015',
            windspeedKmph: '8',
            weatherDesc: 'Clear',
            areaName: 'Tokyo',
            country: 'Japan'
        },
        'new york': {
            temp_C: '18',
            FeelsLikeC: '16',
            humidity: '72',
            pressure: '1012',
            windspeedKmph: '15',
            weatherDesc: 'Light rain',
            areaName: 'New York',
            country: 'United States'
        },
        'paris': {
            temp_C: '12',
            FeelsLikeC: '10',
            humidity: '80',
            pressure: '1010',
            windspeedKmph: '10',
            weatherDesc: 'Overcast',
            areaName: 'Paris',
            country: 'France'
        },
        'sydney': {
            temp_C: '25',
            FeelsLikeC: '27',
            humidity: '60',
            pressure: '1018',
            windspeedKmph: '6',
            weatherDesc: 'Sunny',
            areaName: 'Sydney',
            country: 'Australia'
        }
    };
    
    const cityKey = city.toLowerCase();
    const data = mockData[cityKey] || {
        temp_C: '20',
        FeelsLikeC: '19',
        humidity: '70',
        pressure: '1013',
        windspeedKmph: '10',
        weatherDesc: 'Partly cloudy',
        areaName: city,
        country: 'Unknown'
    };
    
    return {
        current_condition: [{
            temp_C: data.temp_C,
            FeelsLikeC: data.FeelsLikeC,
            humidity: data.humidity,
            pressure: data.pressure,
            windspeedKmph: data.windspeedKmph,
            weatherDesc: [{ value: data.weatherDesc }]
        }],
        nearest_area: [{
            areaName: [{ value: data.areaName }],
            country: [{ value: data.country }]
        }],
        isMockData: true
    };
}

function displayWeatherData(data, searchedCity) {
    try {
        const current = data.current_condition[0];
        const location = data.nearest_area[0];
        
        // Display city name
        const displayName = location.areaName[0].value;
        const country = location.country[0].value;
        cityName.textContent = `${displayName}, ${country}`;
        
        // Show mock data indicator if using mock data
        if (data.isMockData) {
            cityName.textContent += ' (Demo Data)';
        }
        
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