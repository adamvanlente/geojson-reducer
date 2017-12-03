
const parseJson = require('parse-json');

const findFeatures = (geoJson) => {
  if (!geoJson.features) return
  let features = geoJson.features
  features.map((feature, index) => {
    findCoordinates(feature, index)
  })
}

const findCoordinates = (feature, index) => {
  if (!feature.geometry) return
  if (!feature.geometry.coordinates) return
  let coordinates = feature.geometry.coordinates

  mapCoordinates(coordinates)
}

const PCT = 2

const countCoordinates = (coordinates) => {
  coordinates.map((coordinate, index) => {
    if (typeof coordinate == 'object' && typeof coordinate[0] == 'object') {
      mapCoordinates(coordinate)
    } else {
      coordinateCounter++
    }
  })
}

const mapCoordinates = (coordinates) => {
  coordinates.map((coordinate, index) => {
    if (typeof coordinate == 'object' && typeof coordinate[0] == 'object') {
      mapCoordinates(coordinate)
    } else {
      totalCoords++
      if (totalCoords % PCT == 0) {
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

const coordinatesAreSimilar = (coordinate, previousCoordinate) => {
  // return true
  if (!coordinate || !previousCoordinate) return false

  let lat = coordinate[0]
  let lon = coordinate[1]
  let prevLat = previousCoordinate[0]
  let prevLon = previousCoordinate[1]

  let latDiff = (Math.abs(lat - prevLat))
  let lonDiff = (Math.abs(lon - prevLon))

  return (latDiff < 0.01 && lonDiff < 0.01)
}

const removalMessage = (coord) => {
  console.log(`Removing non-critical coord at ${coord}`)
}

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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

exports.reduceCoordinates = (data, isVerbose) => {
  try {

    data = parseJson(data)

    verbose = isVerbose

    totalCoords = 0
    coordCount = 0
    removedCoordCount = 0
    prevCoord

    findFeatures(data)
    messageAfterReduction()

    return data
  } catch(e) {
    console.log(e)
    return `There was an issue parsing the GeoJson: ${e}`
  }
}
