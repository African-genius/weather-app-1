import React, { useState, useEffect } from 'react';
import './App.css';  // Ensure the import matches the filename

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(''); // Track day or night
  const [localTime, setLocalTime] = useState(''); // Track current time

  const apiKey = '229f62b1429378340e3850a226e8c11a';

  const cities = ["London", "Paris", "New York", "Tokyo", "Berlin", "Sydney", "Moscow", "Los Angeles"]; // Example city list

  useEffect(() => {
    // Clear suggestions when the city input changes
    if (city) {
      setSuggestions(cities.filter((name) => name.toLowerCase().includes(city.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  }, [city]);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
        setError('');
        setSuggestions([]); // Clear suggestions after search
        setCity(''); // Clear search box after result

        // Determine Day or Night
        const currentTime = new Date().getTime() / 1000; // Get current time in Unix timestamp
        const isDayTime = currentTime >= data.sys.sunrise && currentTime <= data.sys.sunset;
        setTimeOfDay(isDayTime ? 'Day' : 'Night');

        // Format the current time, sunrise, and sunset
        setLocalTime(new Date(data.dt * 1000).toLocaleTimeString()); // Local time
      } else {
        setWeather(null);
        setError('City not found. Please try again.');
        setSuggestions([]); // Clear suggestions after error
        setCity(''); // Clear search box after error
      }
      setLoading(false);
    } catch (error) {
      setWeather(null);
      setError('Failed to fetch weather data. Please try again.');
      setLoading(false);
      setSuggestions([]);
      setCity('');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeather(city);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    fetchWeather(suggestion);
  };

  // Icons for Day/Night and Sunrise/Sunset
  const dayIcon = <span role="img" aria-label="daytime">🌞</span>;
  const nightIcon = <span role="img" aria-label="nighttime">🌙</span>;
  const sunriseIcon = <span role="img" aria-label="sunrise">🌅</span>;
  const sunsetIcon = <span role="img" aria-label="sunset">🌇</span>;

  // Dynamic styling based on time of day
  const backgroundStyle = timeOfDay === 'Day' ? '#87CEFA' : '#2C3E50'; // Light blue for day, dark blue for night
  const textColor = timeOfDay === 'Day' ? '#000' : '#fff'; // Dark text for day, light text for night
  const iconColor = timeOfDay === 'Day' ? '#00008B' : '#fff'; // Dark blue for day, white for night

  // CSS class for night mode inversion
  const iconClass = timeOfDay === 'Night' ? 'night-icon' : '';

  return (
    <div className="container" style={{ backgroundColor: backgroundStyle, color: textColor }}>
      <h1>Weather App</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            color: textColor, // Adjust text color based on time of day
            backgroundColor: timeOfDay === 'Day' ? '#fff' : '#333', // Adjust background for input field
          }}
        />
        <span
          className="search-icon"
          onClick={handleSearch}
          style={{ color: iconColor }} // Adjust icon color based on time of day
        >
          🔍
        </span>
      </div>

      {/* Display suggestions */}
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((suggestion, index) => (
            <div key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {loading && <div className="loader">Loading...</div>}

      {error && <p className="error-message">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            className={`weather-icon ${iconClass}`}
          />
          <p>{weather.weather[0].description}</p>

          <div className="weather-details">
            <div>
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/temperature.png"
                alt="temperature"
                className={`weather-icon ${iconClass}`} // Apply night mode style to icons
              />
              <p>Temp: {weather.main.temp}°C</p>
            </div>
            <div>
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/humidity.png"
                alt="humidity"
                className={`weather-icon ${iconClass}`} // Apply night mode style to icons
              />
              <p>Humidity: {weather.main.humidity}%</p>
            </div>
            <div>
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/wind.png"
                alt="wind-speed"
                className={`weather-icon ${iconClass}`} // Apply night mode style to icons
              />
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          </div>

          {/* Add time and day/night information */}
          <p>Current Time: {localTime}</p>
          <p>{timeOfDay === 'Day' ? dayIcon : nightIcon} It's {timeOfDay} Time</p>

          {/* Sunrise and Sunset times */}
          <div className="sun-info">
            <p>{sunriseIcon} Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>{sunsetIcon} Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
