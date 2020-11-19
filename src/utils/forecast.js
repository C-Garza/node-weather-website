const request = require("request");
const {weatherAPIKey: API_KEY} = require("./keys");

const forecast = (lat, long, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${lat},${long}&units=f`;

  request({url, json: true}, (err, {body} = {}) => {
    if(err) {
      callback("Unable to connect to weather service.");
    }
    else if(body.error) {
      callback("Unable to find location. Try another search.");
    }
    else {
      const data = body.current;
      callback(undefined, `${data.weather_descriptions[0]}. It is currently ${data.temperature} degrees out. It feels like ${data.feelslike} degrees.`);
    }
  });
};

module.exports = forecast;