// MODULE
const http = require('http')
// MIDDLEWARE
const Middleware = require('./utility/middleware')
const middleware = new Middleware()
const static = middleware.static('public')
// SEEDER
const restaurants = require('./seeder/restaurants.json').results
// SERVER
const server = http.createServer()
const host = 'localhost'
const port = 3000
server.on('request', requestListener)
server.listen(port, () => console.log(`http://${host}:${port}`))

function requestListener(request, response) {
  const url = new URL(request.url, `http://${host}:${port}`)
  const urlParams = url.searchParams
  const pathname = url.pathname
  const id = Number(pathname.match(/\d+/g))
  response.setHeader('Access-Control-Allow-Origin', '*')
  static(request, response, () => {
    // GET // root // (/)
    if (pathname === '/') {
      response.writeHead(302, { Location: '/restaurants' })
      response.end('<h1>This is the root</h1>')
    }
    // GET // index // (/restaurants)
    else if (pathname === '/restaurants') {
      response.end('<h1>This is INDEX page</h1>')
    }
    // GET // detail // (/restaurant/id)
    else if (pathname === `/restaurant/${id}`) {
      response.end(`<h1>This is DETAIL page: ${id}</h1>`)
    }
    // ERROR - 404
    else {
      response.writeHead(404)
      response.end('<h1>Not Found</h1>')
    }
  })
}
