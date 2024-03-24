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
      if (
        request.method === 'POST' &&
        request.headers['content-type'] === 'application/x-www-form-urlencoded'
      ) {
        let body = ''
        request.on('data', (chunk) => (body += chunk.toString()))
        request.on('end', () => {
          const postData = querystring.parse(body)
          const query = url.parse(request.url, true).query
          if (query && query._method) {
            request.method = query._method.toUpperCase()
          }
          next(postData)
        })
      } else {
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
  } else if (ext === '.json') {
    return 'application/json'
  }
}

module.exports = Middleware
