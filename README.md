# geojson-reducer


[![Foo](https://badge.fury.io/js/geojson-reducer.svg)](https://www.npmjs.com/package/geojson-reducer)


geojson-reducer is a node package that simplifies a Polygon or MultiPolyon feature within a GeoJson object.

This package helps ease the load time of geospatial web applications that are displaying complex Polygons. These Polygons may have thousands of coordinates, many of which may not be critical to achieve the basic shape of the Polygon. Perhaps the Polygons load slowly, or perhaps a file being requested is simply too large.

geojson-reducer takes a simple approach, by ejecting coordinates that it considers non-essential to the shape of the Polygon. The result is that the data set is reduced - by up to 50% if possible - while providing an identical experience to the end user of the application or data.

## Installation
---

To install via npm, use the following command.

```
npm i -g geojson-reducer
```

## Usage
---

#### Command line

A common use case for this package is the simply reduce the size of a large file. This can be done with the following command:

```
$ geojson-reducer ./filename.geojson
```

This command will result in a smaller file with the name `filename-sm.geojson` to be placed in your current directory.

###### Optional arugments

```
$ geojson-reducer ./filename.geojson -d specific-file-name.json
```

Give your new file a specific name with the `-d` destination flag.

```
$ geojson-reducer ./filename.geojson -v
```

Use the `-v` flag for a verbose printout of all the coordinates being removed from the Polygon.

#### Imported

Use this package in Node like so:

```
let geojsonReducer = require('geojson-reducer')

let reducedGeoJson = geojsonReducer.reduceCoordinates(originalGeoJson)

```

## [See it in action](https://adamvanlente.github.io/geojson/)
---
