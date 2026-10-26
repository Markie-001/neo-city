const date = document.getElementById('date');
const city = document.getElementById('city');
const iconTemp = document.getElementById('iconTemp');
const main = document.getElementById('main');
const temp = document.getElementById('temp');
const deg = document.getElementById('deg');
const speed = document.getElementById('speed');
const tempMin = document.getElementById('tempMin');
const tempMax = document.getElementById('tempMax');

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let dateNow = new Date();
let month = months[dateNow.getUTCMonth()];
let day = dateNow.getUTCDate();
let year = dateNow.getUTCFullYear();

date.innerHTML = `${day} ${month}, ${year}`;

const cities = ['Rotterdam', 'Amsterdam', 'Tokyo', 'Paris', 'London', 'Sydney', 'Cairo', 'Manila', 'New York'];
const randomCity = cities[Math.floor(Math.random() * cities.length)];

async function loadWeather() {
        try {
                const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${randomCity}&appid=bf37ba0fb84c731478ed6fe7105a874a&units=metric`);
                
                const weatherInfo = await weather.json();
                console.log(weatherInfo)

                city.innerHTML = `${weatherInfo.name}`;
                temp.innerHTML = `${Math.round(weatherInfo.main.temp)}°C`;
                iconTemp.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png" />`;
                main.innerHTML = `${weatherInfo.weather[0].main}`;
                deg.innerHTML = `${weatherInfo.wind.deg}°`;
                speed.innerHTML = `${Math.round(weatherInfo.wind.speed)} m/s`;
                tempMin.innerHTML = `${Math.round(weatherInfo.main.temp_min)}°C`;
                tempMax.innerHTML = `${Math.round(weatherInfo.main.temp_max)}°C`;
        } catch(error) {
                console.log(error);
        }
}

loadWeather();

export function createWeatherScreen() {
  return document.getElementById('weather-container');
}