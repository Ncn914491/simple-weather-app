# Simple Weather App 🌤️

A clean, responsive weather application that provides current weather information for any city worldwide.

## Features

- 🌍 Get weather data for any city worldwide
- 🎨 Modern, responsive design with beautiful gradients
- ⚡ Fast and lightweight - no external dependencies
- 🔥 No API key required - uses free wttr.in service
- 📱 Mobile-friendly responsive layout
- 🎯 Input validation and error handling
- 🌈 Weather-specific icons and descriptions

## Live Demo

Simply open `index.html` in any modern web browser to start using the app.

## How to Use

1. Enter a city name in the search input field
2. Click "Get Weather" or press Enter
3. View current weather conditions including:
   - Temperature and "feels like" temperature
   - Weather description with appropriate emoji
   - Humidity percentage
   - Wind speed
   - Atmospheric pressure
   - Location and current time

## Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with flexbox, grid, and animations
- **Vanilla JavaScript** - API integration and DOM manipulation
- **wttr.in API** - Free weather data service (no API key required)

## API Information

This application is designed to work with weather APIs but includes mock data for demonstration purposes:

**Primary API:** OpenWeatherMap (requires free API key)
- Sign up at [OpenWeatherMap](https://openweathermap.org/api) for a free API key
- Replace the 'demo' API key in script.js with your actual key
- Provides real-time weather data globally

**Demo Mode:** Mock weather data
- Works without internet connection
- Includes data for: London, Tokyo, New York, Paris, Sydney
- Shows "(Demo Data)" indicator
- Perfect for testing and demonstration

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with ES6+ support

## Installation & Setup

1. Clone or download this repository
2. No build process required - just open `index.html` in your browser
3. Ensure you have an active internet connection for API calls

## Project Structure

```
simple-weather-app/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md          # Project documentation
```

## Features in Detail

### Responsive Design
- Mobile-first approach
- Adapts to different screen sizes
- Touch-friendly interfaces

### Error Handling
- Network error detection
- Invalid city name handling
- User-friendly error messages
- Input validation

### User Experience
- Loading indicators
- Smooth animations
- Intuitive interface
- Keyboard shortcuts (Enter to search)

## Future Enhancements

- [ ] 5-day weather forecast
- [ ] Geolocation support
- [ ] Temperature unit conversion (°C/°F)
- [ ] Weather history
- [ ] Favorite cities
- [ ] Dark mode toggle

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Weather data provided by [wttr.in](https://wttr.in)
- Icons using Unicode emoji characters
- Inspired by modern weather app designs

---

Made with ❤️ for learning purposes