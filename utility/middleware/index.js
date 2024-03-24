// MODULE
const path = require('path')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')

class Middleware {
  static(directory) {
    const staticPath = path.resolve(__dirname, '..', '..', directory)
    const staticFiles = []
    ;(function iterateFiles(dirPath) {
      const items = fs.readdirSync(dirPath, 'utf8')
      items.forEach((item) => {
        const itemPath = path.join(dirPath, item)
        const stats = fs.statSync(itemPath)
        if (stats.isFile()) {
          let relativePath = path.relative(staticPath, itemPath)
          const isWindowsPath = /\\/.test(relativePath)
          relativePath = isWindowsPath ? relativePath.replace(/\\/g, '/') : relativePath
          staticFiles.push('/' + relativePath)
        } else {
          iterateFiles(itemPath)
        }
      })
    })(staticPath)
    return (request, response, next) => {
      if (staticFiles.some((file) => file === request.url)) {
        const filePath = path.join(staticPath, request.url)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const contentType = type(filePath)
        response.setHeader('Content-Type', contentType)
        response.end(fileContent)
        return
      }
      next()
    }
  }
  methodOverride() {
    return (request, response, next) => {
      console.log('Enter middleware url: ', request.url)
      console.log('Enter middleware method: ', request.method)
      if (
        request.method === 'POST' &&
        request.headers['content-type'] === 'application/x-www-form-urlencoded'
      ) {
        let body = ''
        request.on('data', (chunk) => (body += chunk.toString()))
        request.on('end', () => {
          const postData = querystring.parse(body)
          const query = url.parse(request.url, true).query
          console.log('query: ', query)
          console.log('query._method: ', query._method)
          if (query && query._method) {
            request.method = query._method.toUpperCase()
          }
          console.log('Leaving middleware url: ', request.url)
          console.log('Leaving middleware method: ', request.method)
          next(postData)
        })
      } else {
        // console.log('passed')
        next()
      }
    }
  }
}

function type(filePath) {
  const ext = path.extname(filePath)
  if (ext === '.css') {
    return 'text/css'
  } else if (ext === '.js') {
    return 'application/javascript'
  } else if (ext === '.png') {
    return 'image/png'
  }
}

module.exports = Middleware
