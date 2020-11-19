const request = require("request");
const {mapBoxAPIKey: API_KEY} = require("./keys");

const geoCode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${API_KEY}&limit=1`;
  request({url, json: true}, (err, {body} = {}) => {
    if(err) {
      callback("Unable to connect to location services!");
    }
    else if(body.message === "Forbidden" || body.features.length === 0) {
      callback("Forbidden: 403");
    }
    else if(!body.features.length) {
      callback("Unable to find location. Try another search.");
    }
    else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name
      });
    }
  });
};

module.exports = geoCode;