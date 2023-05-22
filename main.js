import { waitForElement, getCardinalDirection } from './src/scripts/util.js'

// Wait for forecast list to load, and insert days into HTML starting with current day.
const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTY4NDcxMTU1MywiZXhwIjo5OTk5OTk5OTk5LCJuYmYiOjE2ODQ3MTE1NTMsImp0aSI6IjI3NmY5YjUyZmQwY2FlZjkiLCJzdWIiOiJzcHJhbnRtYXN0ZXIiLCJmbXQiOiJYRGNPaGpDNDArQUxqbFlUdGpiT2lBPT0ifQ.opBKIMnkMzVAOgJVwn26g7E1ZXMJre0TeuSENhbksfI'

const date = new Date();
const dayOfWeek = date.getDay();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const formattedDate = date.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});

waitForElement('.forecast__date').then((date) => {
  date.textContent = formattedDate.toUpperCase();
});

waitForElement('.location').then((location) => {
  const input = location.querySelector('.location__input');
  const button = location.querySelector('.location__search');

  button.addEventListener('click', () => {
    const { value } = input;

    if (!value) { return; }
    button.classList.add('loading');

    fetch(`https://pfa.foreca.com/api/v1/location/search/${value}?token=${API_TOKEN}`).then(res => res.json()).then(data => {
      const { locations: [result]} = data;
      fetchWeather(result.id, result.name)
    }).catch((error) => {
      console.log(error);
      button.classList.remove('loading');
    });;
  })
})

const fetchWeather = (location, name) => {
  Promise.all([fetch(`https://pfa.foreca.com/api/v1/forecast/daily/${location}?token=${API_TOKEN}&tempunit=F&windunit=MPH`).then(res => res.json()),
  fetch(`https://pfa.foreca.com/api/v1/current/${location}?token=${API_TOKEN}&tempunit=F&windunit=MPH`).then(res => res.json()),
  waitForElement('.forecast__list'),
  waitForElement('.forecast__main'),
  waitForElement('.forecast'),
  ]).then(([forecastData, currentData, forecastList, forecastMain, forecastContainer]) => {
    const { forecast } = forecastData;
    const { current } = currentData;
    const button = document.querySelector('.location__search');


    const indexArray = Array.from(new Array(7), (x,i) => i)
  
    // Reordered days array so that current day is at the start of the list.
    const daysReordered = indexArray.slice(dayOfWeek).concat(indexArray.slice(0, dayOfWeek))
  
    let forecastHTML = ``;
  
    for (let i = 1; i < daysReordered.length; i++) {
      const index = daysReordered[i];

      forecastHTML += `
        <li class="forecast__list-item">
          <div class="forecast__day">
            <span>${days[index].substring(0, 3).toUpperCase()}</span>
            <div class="forecast__icon">
              <img src="https://developer.foreca.com/static/images/symbols/${forecast[index].symbol}.png" />
            </div>
          </div>
          <div class="forecast__temp-container">
          <div class="forecast__temp forecast__temp--high">
            <span class="forecast__temp-degree">${forecast[index].maxTemp}&deg;F</span>
            <span>HIGH</span>
            </div>
            <div class="forecast__temp forecast__temp--high">
              <span class="forecast__temp-degree">${forecast[index].minTemp}&deg;F</span>
              <span>LOW</span>
            </div>
          </div>
          <div class="forecast__extra">
            <div class="forecast__wind-speed">
              <span>${forecast[index].maxWindSpeed} mph</span>
              <span>WIND</span>
            </div>
            <div class="forecast__wind-dir">
              <span>${getCardinalDirection(forecast[index].windDir)}</span>
              <span>WIND</span>
            </div>
            <div class="forecast__rain">
              <span>${forecast[index].precipAccum}</span>
              <span>RAIN</span>
            </div>
          </div>
        </li>`;
    }

    const forecastMainHTML = `<div class="forecast__list-item">
      <div class="forecast__main-container">
        <div class="forecast__main-left">
          <div class="forecast__day forecast__day--desktop">${name} - ${days[dayOfWeek]}</div>
          <div class="forecast__summary">
            <h2>Daily Summary:</h2>
            <p>In Texas today, the weather brings mild temperatures, ranging from a cool start to a comfortably warm peak. However, due to the wind chill, it may feel slightly colder than the actual temperature. The air carries a noticeable level of humidity, indicating a fair amount of moisture in the atmosphere. A gentle breeze blows from the north, providing a pleasant and calming effect. Fortunately, there is no chance of rain or any other form of precipitation expected for the day.</p>
          </div>
        </div>
        <div class="forecast__main-right">
          <div class="forecast__day forecast__day--mobile">FORECAST TODAY - ${days[dayOfWeek]}</div>
          <div class="forecast__main-forecast">
            <div class="forecast__icon"><img src="https://developer.foreca.com/static/images/symbols/${current.symbol}.png" /></div>
            <div class="forecast__temp">${current.temperature}&deg;</div>
            <div class="forecast__unit">Fahrenheit</div>
          </div>
          <div class="forecast__bottom">
            <div class="forecast__wind-speed forecast__bottom-info">
              <img src="https://bmcdn.nl/assets/weather-icons/v3.0/line/svg/wind.svg" alt="wind icon" />
              <span>${current.windSpeed} mph</span>
              <span>WIND SPD</span>
            </div>
            <div class="forecast__wind-dir forecast__bottom-info">
              <img src="https://bmcdn.nl/assets/weather-icons/v3.0/line/svg/compass.svg" alt="windsock" />
              <span>${getCardinalDirection(current.windDir)}</span>
              <span>WIND DIR</span>
            </div>
            <div class="forecast__rain forecast__bottom-info">
              <img src="https://bmcdn.nl/assets/weather-icons/v3.0/line/svg/raindrops.svg" alt="umbrella" loading="lazy">
              <span>${current.precipRate}%</span>
              <span>RAIN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    forecastMain.innerHTML = forecastMainHTML;
    forecastList.innerHTML = forecastHTML;
    forecastContainer.classList.add('active');
    button.classList.remove('loading');
  });
}

// Example Object
// {
//   "current": {
//     "time": "2023-05-21T05:36+03:00",
//     "symbol": "d000",
//     "symbolPhrase": "clear",
//     "temperature": 45,
//     "feelsLikeTemp": 43,
//     "relHumidity": 82,
//     "dewPoint": 40,
//     "windSpeed": 4,
//     "windDir": 350,
//     "windDirString": "N",
//     "windGust": 7,
//     "precipProb": 1,
//     "precipRate": 0,
//     "cloudiness": 0,
//     "thunderProb": 0,
//     "uvIndex": 0,
//     "pressure": 1030.49,
//     "visibility": 10567
//   }
// }

// Example 2
// {
//   "date": "2023-05-21",
//   "symbol": "d200",
//   "maxTemp": 68,
//   "minTemp": 46,
//   "precipAccum": 0,
//   "maxWindSpeed": 8,
//   "windDir": 201
// }