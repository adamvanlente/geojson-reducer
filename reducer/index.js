
/*
 * Find features on the main GeoJson object.
 *
 */
const findFeatures = (geoJson) => {
  if (!geoJson.features) return
  geoJson.features.map((feature, index) => {
    findCoordinates(feature, index)
  })
}

/*
 * Find coordinates on a GeoJson Feature.
 *
 */
const findCoordinates = (feature, index) => {
  if (!feature.geometry) return
  if (!feature.geometry.coordinates) return
  mapCoordinates(feature.geometry.coordinates)
}

/*
 * Traverse all of the coordinates in the GeoJson, and remove any that
 * do not seem critical to the specific shape of the object.
 *
 */
const mapCoordinates = (coordinates) => {
  coordinates.map((coordinate, index) => {
    if (typeof coordinate == 'object' && typeof coordinate[0] == 'object') {
      mapCoordinates(coordinate)
    } else {
      totalCoords++
      if (totalCoords % 2 == 0) {
        if (coordinatesAreSimilar(coordinate, prevCoord)) {
          coordinates.splice(index, 1)
          removedCoordCount++
          if (verbose) removalMessage(coordinate)
        } else {
          coordCount++
          prevCoord = coordinate
        }
      } else {
        coordCount++
        prevCoord = coordinate
      }
    }
  })
}

/*
 * Deterime if coordinates are similar. If so, we determine that it is safe
 * enough to remove 'coordinate'. If not, `coordinate` is considered unique,
 * and at least somewhat critical to the overall shape of the GeoJson feature.
 *
 */
const coordinatesAreSimilar = (coordinate, previousCoordinate) => {
  if (!coordinate || !previousCoordinate) return false

  let lat = coordinate[0]
  let lon = coordinate[1]
  let prevLat = previousCoordinate[0]
  let prevLon = previousCoordinate[1]

  let latDiff = (Math.abs(lat - prevLat))
  let lonDiff = (Math.abs(lon - prevLon))

  return (latDiff < 0.01 && lonDiff < 0.01)
}

// Message that a set of coordinates has been removed.
const removalMessage = (coord) => console.log(`Removing non-critical coord at ${coord}`)

// Add commas to a number.
const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Message after reduction has been completed.
const messageAfterReduction = () => {
  let pct = (coordCount / totalCoords) * 100
  console.log(
`
-----
  Original GeoJson has ${numberWithCommas(totalCoords)} coordinates.
  Reduced down to ${numberWithCommas(coordCount)}; removed ${numberWithCommas(removedCoordCount)} coords.
  Result: ${pct.toFixed(0)}% of coordinates removed.
-----
`)
}

let totalCoords
let coordCount
let removedCoordCount
let prevCoord
let coordinateCounter
let verbose

/*
 * Core function that begins the process of reducing coordinates.
 *
 */
exports.reduceCoordinates = (data, isVerbose) => {
  try {

    // Parse data to JSON.
    data = JSON.parse(data)

    // Determine if verbose flag has been passed in.
    verbose = isVerbose

    // Reset global vars.
    totalCoords = 0
    coordCount = 0
    removedCoordCount = 0
    prevCoord

    // Find features, and reduce coordinates on each feature.
    findFeatures(data)

    // Feedback about reduction results.
    messageAfterReduction()

    return data
  } catch(e) {
    console.log(e)
    return `There was an issue parsing the GeoJson: ${e}`
  }
}
