const reducer = require('./reducer/')

exports.reduceGeoJson = (geoJson) => {
  return reducer.reduceCoordinates(geoJson)
}
