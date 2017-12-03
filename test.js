const reducer  = require('./reducer/')
const fs       = require('fs')

const testFile = './test-data/netherlands-data.json'

console.log('===============================================')
console.log('===============================================')
console.log(`Testing file: ${testFile}`)

fs.readFile(testFile, 'latin1', function (err, data) {
  if (!err) {
    let reducedJson = reducer.reduceCoordinates(data)
    console.log('===============================================')
    console.log('===============================================')
  } else {
    console.log(`Error parsing test file: ${testFile}`)
  }
})
