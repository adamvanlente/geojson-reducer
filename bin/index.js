const reducer = require('../reducer/')
const fs      = require('fs')

/*
 * Returns user specified destination file name from command line.
 *
 */
const userSpecifiedDestination = () => {
  if (args[3] && args[3] == '-d' || args[3] && args[3] == '-destination') {
    if (args[4]) return args[4]
  }

  return
}

/*
 * Returns default destination name, which is simply "sourceFile-reduced.json".
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
    let reducedJson = reducer.reduceCoordinates(data)
    fs.writeFile(destination, JSON.stringify(reducedJson), function(err) {
      console.log('********************************************************')
      console.log('********************************************************')
      console.log(`--> Reduced file saved at this location: ${destination}`)
      console.log('********************************************************')
      console.log('********************************************************')
    });
  }
})


'./some.crazy-filename.stuff.js'
