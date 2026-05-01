// API

const link = "http://api.weatherstack.com/current?access_key=32b828803275d566701ab4c7a4de1f22"; 

// Получаю данные из HTML 

const root = document.getElementById("root"); 
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");
 
// Создаю объект 

let store = {
  city: "Moscow",
  temperature: 0,
  observationTime: "00:00 AM",
  isDay: "yes",
  description: "",
  properties: {
    cloudcover: {},
    humidity: {},
    windSpeed: {},
    pressure: {},
    uvIndex: {},
    visibility: {},
  },
};


const fetchData = async () => {   /* Сначала пытается получить данные из localStorage по ключу "query". 
                                    Если там есть данные (не null, не undefined и т. д.), то переменная query 
                                    получит это значение. Если в localStorage нет данных (возвращается null), 
                                    то переменной query будет присвоено значение store.city. */ 
    
try {                                                             
    const query = localStorage.getItem("query") || store.city; 
    const result = await fetch(`${link}&query=${query}`);          //  Отправил запрос на сервер                                                   
    const data = await result.json();                               // Дождался ответа
      
 const {
      current: {
        cloudcover,
        temperature,
        humidity,
        observation_time: observationTime,
        pressure,
        uv_index: uvIndex,
        visibility,
        is_day: isDay,
        weather_descriptions: description,
        wind_speed: windSpeed,
      },
      location: { name },
    } = data;


                     // Коробка где лежит текущее состояние погоды  
    store = {         /* Ты достаёшь из посылки (data) нужные вещи и перекладываешь 
                         в свою коробку (store). Старые вещи остаются на месте, если их не трогать.*/
      ...store,
      isDay,
      city: name,
      temperature,
      observationTime,
      description: description[0],
      properties: {
        cloudcover: {
          title: "cloudcover",
          value: `${cloudcover}%`,
          icon: "cloud.png",
        },
        humidity: {
          title: "humidity",
          value: `${humidity}%`,
          icon: "humidity.png",
        },
        windSpeed: {
          title: "wind speed",
          value: `${windSpeed} km/h`,
          icon: "wind.png",
        },
        pressure: {
          title: "pressure",
          value: `${pressure} %`,
          icon: "gauge.png",
        },
        uvIndex: {
          title: "uv Index",
          value: `${uvIndex} / 100`,
          icon: "uv-index.png",
        },
        visibility: {
          title: "visibility",
          value: `${visibility}%`,
          icon: "visibility.png",
        },
      },
    };

    renderComponent();  /* После того как store обновился, вызывается renderComponent() */
                        
  } catch (err) { 
    console.log(err);
  }
};

const getImage = (description) => {
  const value = description.toLowerCase();

  switch (value) {
    case "partly cloudy":
      return "partly.png";
    case "cloud":
      return "cloud.png";
    case "fog":
      return "fog.png";
    case "sunny":
      return "sunny.png";
    case "cloud":
      return "cloud.png";
    default:
      return "the.png"; 
  }
};

const renderProperty = (properties) => {
  return Object.values(properties)
    .map(({ title, value, icon }) => {
      return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
          </div>`;
    })
    .join("");
};

const markup = () => {
  const { city, description, observationTime, temperature, isDay, properties } =
    store;
  const containerClass = isDay === "yes" ? "is-day" : "";

  return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                <img class="icon" src="./img/${getImage(description)}" alt="" />
                <div class="description">${description}</div>
              </div>
            
              <div class="top-right">
                <div class="city-info__subtitle">as of ${observationTime}</div>
                <div class="city-info__title">${temperature}°</div>
              </div>
            </div>
          </div>
        <div id="properties">${renderProperty(properties)}</div>
      </div>`;
};

const togglePopupClass = () => {
  popup.classList.toggle("active");
};

const renderComponent = () => {   /* Функция делает одну главную вещь: root.innerHTML = markup();
                                    markup() — это функция, которая возвращает строку с HTML-кодом, используя данные из store.  */
  root.innerHTML = markup();

const city = document.getElementById("city");
  city.addEventListener("click", togglePopupClass);
};

const handleInput = (e) => {
  const { value } = e.target;  // деструктуризация
  store = {
    ...store,
    city: value,
  };
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;

  if (!value) return null;

  localStorage.setItem("query", value);
  fetchData();
  togglePopupClass();
};

form.addEventListener("submit", handleSubmit);
textInput.addEventListener("input", handleInput);


fetchData();
 