// MODULE
const http = require('http')
// MIDDLEWARE
const Middleware = require('./utility/middleware')
const middleware = new Middleware()
const static = middleware.static('public')
// SEEDER
const restaurants = require('./seeder/restaurants.json').results
// TEMPLATE ENGINE
const render = require('./utility/template-engine')
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
      const keyword = urlParams.get('search')
      const matched = keyword
        ? restaurants.filter((rest) => {
            const nameMatch = rest.name.toLowerCase().includes(keyword.toLowerCase())
            const nameEnMatch = rest.name_en.toLowerCase().includes(keyword.toLowerCase())
            return nameMatch || nameEnMatch
          })
        : restaurants
      const index = render('index', { restaurants: matched, keyword })
      response.end(index)
    }
    // GET // detail // (/restaurant/id)
    else if (pathname === `/restaurant/${id}`) {
      const restaurant = restaurants.find((rest) => rest.id === id)
      const detail = render('detail', { restaurant })
      response.end(detail)
    }
    // ERROR - 404
    else {
      response.writeHead(404)
      response.end('<h1>Not Found</h1>')
    }
  })
}
