window.getWeather = async function () {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "d48371d7b19a0f3c6df16afc2e92738f";
  const url =` https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // 🌤 Fetch current weather
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    // 📅 Fetch 5-day forecast
    const forecastResponse = await fetch(
     ` https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!forecastResponse.ok) throw new Error("Forecast data not found");
    const forecastData = await forecastResponse.json();

    // 🔍 Filter forecast data to show only 12:00 PM each day
    const dailyForecasts = forecastData.list.filter(f =>
      f.dt_txt.includes("12:00:00")
    );

    // 🧊 Update background based on weather
    document.body.className = '';
    const weatherMain = data.weather[0].main.toLowerCase();
    document.body.classList.add(weatherMain);

    // 🌡 Build current weather HTML
    const html = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>${data.weather[0].main} - ${data.weather[0].description}</p>
      <p>Temp: ${data.main.temp}°C</p>
      <p>Wind: ${data.wind.speed} m/s</p>
    `;

    // 📆 Build 5-day forecast HTML
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

    // 🖼 Render both current weather and forecast
    document.getElementById("weatherResult").innerHTML = html + forecastHTML;

  } catch (error) {
    // ❌ Show errors nicely
    console.error("Error:", error);
    document.getElementById("weatherResult").innerHTML =` <p>${error.message}</p>`;
  }
};

// 🔘 Button Event Listeners
document.getElementById("weatherBtn").addEventListener("click", getWeather);

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("cityInput").value = "";
  document.getElementById("weatherResult").innerHTML = "";
  document.body.className = "";
});