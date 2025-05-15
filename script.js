const apiKey = "1174931df925007898d5840de39faff2";  // Replace with your OpenWeatherMap API key
const submitButton = document.getElementById("submit-button");
const cityInput = document.getElementById("city-input");
const weatherIcon = document.getElementById("weather-icon");
const cityName = document.getElementById("city-name");
const weatherDescription = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const tempMin = document.getElementById("temp-min");
const tempMax = document.getElementById("temp-max");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const windDirection = document.getElementById("wind-direction");
const rainProbability = document.getElementById("rain-probability"); // Added new element for rain probability
const clouds = document.getElementById("clouds");
const visibility = document.getElementById("visibility");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const currentDay = document.getElementById("current-day");
const currentTime = document.getElementById("current-time");
const currentDate = document.getElementById("current-date");
const timeZone = document.getElementById("time-zone");

submitButton.addEventListener("click", () => {
  const city = cityInput.value;

  if (city) {
    getWeather(city);
  } else {
    alert("Please enter a city name.");
  }
});

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        // Set weather data
        cityName.textContent = data.name;
        weatherDescription.textContent = data.weather[0].description;
        temperature.textContent = `Temperature: ${data.main.temp}°C`;
        feelsLike.textContent = `Feels Like: ${data.main.feels_like}°C`;
        tempMin.textContent = `Min Temp: ${data.main.temp_min}°C`;
        tempMax.textContent = `Max Temp: ${data.main.temp_max}°C`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

        // Get wind direction and convert to cardinal direction
        windDirection.textContent = `Wind Direction: ${getWindDirection(data.wind.deg)}`;

        clouds.textContent = `Clouds: ${data.clouds.all}%`;
        visibility.textContent = `Visibility: ${(data.visibility / 1000).toFixed(2)} km`;
        sunrise.textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
        sunset.textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;

        // Check for rain data (1h or 3h)
        if (data.rain && data.rain['1h']) {
          rainProbability.textContent = `Rain Probability: ${data.rain['1h']} mm in the last hour`;
        } else {
          rainProbability.textContent = 'Rain Probability: No rain detected';
        }

        // Update Time and Date Info
        const currentDateTime = new Date(data.dt * 1000);
        currentDay.textContent = `Day: ${currentDateTime.toLocaleDateString(undefined, { weekday: "long" })}`;
        currentTime.textContent = `Time: ${currentDateTime.toLocaleTimeString()}`;
        currentDate.textContent = `Date: ${currentDateTime.toLocaleDateString()}`;
        timeZone.textContent = `Time Zone: UTC${data.timezone / 3600 >= 0 ? "+" : ""}${data.timezone / 3600}`;
        
        // Determine if it's day or night (based on sunset/sunrise)
        const isDaytime = data.sys.sunrise < data.dt && data.sys.sunset > data.dt;

        // Add appropriate theme for day or night
        if (isDaytime) {
          document.body.classList.remove("dark-theme");
          document.body.classList.add("light-theme");

          // Create and add the sun image with transition
          const sunImage = document.createElement("img");
          sunImage.src = "sun.png";
          sunImage.alt = "Day weather icon";
          weatherIcon.innerHTML = ""; // Clear any existing icon
          weatherIcon.appendChild(sunImage);
          
          // Trigger the transition by adding the "show" class after image is loaded
          sunImage.onload = () => {
            sunImage.classList.add("show");
          };
        } else {
          document.body.classList.remove("light-theme");
          document.body.classList.add("dark-theme");

          // Create and add the moon image with transition
          const moonImage = document.createElement("img");
          moonImage.src = "moon.png";
          moonImage.alt = "Night weather icon";
          weatherIcon.innerHTML = ""; // Clear any existing icon
          weatherIcon.appendChild(moonImage);
          
          // Trigger the transition by adding the "show" class after image is loaded
          moonImage.onload = () => {
            moonImage.classList.add("show");
          };
        }
      } else {
        alert("City not found.");
      }
    })
    .catch(error => {
      console.error("Error fetching weather data: ", error);
      alert("Failed to fetch weather data.");
    });
}

// Function to convert wind direction in degrees to cardinal direction
function getWindDirection(deg) {
  const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  const index = Math.floor((deg + 22.5) / 45) % 8; // Normalize and map degrees to cardinal direction
  return directions[index];
}
