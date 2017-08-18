const fs = require('fs')
const path = require('path')

// Read modules mapping
const moduleMap = require('./module-map.json')

// Read file name you passed in. TODO: could pass in a directory instead of just a file
const file = process.argv[2]
let filePath = ''
if (file) {
  filePath = path.join(__dirname, file)
} else {
  throw new Error('file name required')
}

// Parse out pure file name from file path
const fileName = file.slice(file.lastIndexOf('/')).replace('/', '')

// Write all data to the same file at current directory
const writePath = path.join(__dirname, `${fileName}`)

// Create read/write streams
const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' })
const writeStream = fs.createWriteStream(writePath)

const modulesDefined = Object.keys(moduleMap)

readStream.on('data', chunk => {
  let data = chunk
  modulesDefined.forEach(keyword => {
    // If keyword used in the chunk, replace it and write to rhe file.
    if (data.includes(keyword)) {
      console.log(`Found: module "${keyword}" at file: ${filePath}`)
      data = data.replace(keyword, `'${moduleMap[keyword]}'`)
    }
  })
  writeStream.write(data, () => console.log('write successfully'))
})
