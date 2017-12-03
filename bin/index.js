#!/usr/bin/env node

const reducer = require('../reducer/')
const fs      = require('fs')

/*
 * Determine if this is a verbose readout or not.
 *
 */
const isVerbose = () => args.indexOf('-verbose') != -1

/*
 * Returns user specified destination file name from command line.
 *
 */
const userSpecifiedDestination = () => {
  let destinationIndex = args.indexOf('-d')
  if (destinationIndex !== -1) return args[destinationIndex + 1]

  return
}

/*
 * Returns default destination name, which is simply "sourceFile-sm.json".
 *
 */
const defaultDesintaion = () => {
  let srcFile = srcFileName()
  let array = srcFile.split('.')
  array.splice(array.length - 2, 1, `${array[array.length - 2]}-sm`)

  return array.join('.')
}

/*
 * Get source file name from command line arguments.
 *
 */
const srcFileName = () => args[2]


/*
 * Get information from command line.
 *
 */
let args = process.argv
let srcFile = srcFileName()
let destination = defaultDesintaion()

if (userSpecifiedDestination()) destination = userSpecifiedDestination()

/*
 * Get GeoJson to reduce.
 *
 */
fs.readFile(srcFile, 'latin1', function (err, data) {
  // JSON.parse(data)

  if (!err) {
    let reducedJson = reducer.reduceCoordinates(data, isVerbose())
    fs.writeFile(destination, JSON.stringify(reducedJson), function(err) {
      console.log('********************************************************')
      console.log('********************************************************')
      console.log(`--> Reduced file saved at this location: ${destination}`)
      console.log('********************************************************')
      console.log('********************************************************')
      console.log(' ')
    });
  }
})


'./some.crazy-filename.stuff.js'
