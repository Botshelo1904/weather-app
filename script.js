window.getWeather = async function (city) {
  const apiKey = "d48371d7b19a0f3c6df16afc2e92738f";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // 🌤 Fetch current weather
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    // 📅 Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!forecastResponse.ok) throw new Error("Forecast data not found");
    const forecastData = await forecastResponse.json();

    // 🔍 Filter forecast data
    const dailyForecasts = forecastData.list.filter(f =>
      f.dt_txt.includes("12:00:00")
    );

    // 🧊 Background update
    document.body.className = '';
    const weatherMain = data.weather[0].main.toLowerCase();
    document.body.classList.add(weatherMain);

    // 🌡 Current weather
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const html = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p><img src="${iconUrl}" alt="${data.weather[0].description}" style="margin-right: 8px; vertical-align: middle;" />
      ${data.weather[0].main} - ${data.weather[0].description}</p>
      <p>Temp: ${data.main.temp}°C</p>
      <p>Wind: ${data.wind.speed} m/s</p>
    `;

    // 📆 Forecast
    let forecastHTML = "<h3>5-Day Forecast</h3><div class='forecast'>";
    dailyForecasts.forEach(forecast => {
      const date = new Date(forecast.dt_txt).toDateString();
      const temp = forecast.main.temp;
      const desc = forecast.weather[0].main;

      forecastHTML += `
        <div class="forecast-day">
          <p><strong>${date}</strong></p>
          <p>${desc}</p>
          <p>${temp.toFixed(1)}°C</p>
        </div>
      `;
    });
    forecastHTML += "</div>";

    document.getElementById("weatherResult").innerHTML = html + forecastHTML;

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
  }
};

// 🔘 Button Event Listeners
document.getElementById("weatherBtn").addEventListener("click", getWeather);
document.getElementById("weatherBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeather(city);
  }
});
document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("cityInput").value = "";
  document.getElementById("weatherResult").innerHTML = "";
  document.body.className = "";
});

// 🌍 Auto-fetch by location
window.onload = function () {
  getWeatherByLocation();
};

async function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = "d48371d7b19a0f3c6df16afc2e92738f";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Location weather not found");
        const data = await response.json();

        // Call main weather fetcher with city name
        window.getWeather(data.name);
      } catch (error) {
        console.error("Geo Error:", error);
        document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
      }
    });
  } else {
    alert("Geolocation not supported");
  }
}