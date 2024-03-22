// MODULE
const path = require('path')
const fs = require('fs')

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
