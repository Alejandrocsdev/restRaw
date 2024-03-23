// MODULE
const http = require('http')
// MIDDLEWARE
const Middleware = require('./utility/middleware')
const middleware = new Middleware()
const static = middleware.static('public')
// TEMPLATE ENGINE
const render = require('./utility/template-engine')
// SEEDER
// const restaurants = require('./seeder/restaurants.json').results
const { getData } = require('./mysql/index')
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
  const method = request.method
  response.setHeader('Access-Control-Allow-Origin', '*')
  static(request, response, async () => {
    // GET // root // (/)
    if (pathname === '/') {
      response.writeHead(302, { Location: '/restaurants' })
      response.end('<h1>This is the root</h1>')
    }
    // GET // index // (/restaurants)
    else if (pathname === '/restaurants') {
      const restaurants = await getData('rests')
      const keyword = urlParams.get('search')
      const matched = keyword
        ? restaurants.filter((rest) => {
            const nameMatch = rest.name.toLowerCase().includes(keyword.toLowerCase())
            const nameEnMatch = rest.name_en.toLowerCase().includes(keyword.toLowerCase())
            return nameMatch || nameEnMatch
          })
        : restaurants
      const create = true
      const index = render('index', { restaurants: matched, keyword, create })
      response.end(index)
    }
    // POST // index // (/restaurants)
    else if (pathname === '/restaurants' && method === 'POST') {
      response.end('This is INDEX page (POST)')
    }
    // GET // create // (/restaurant/create)
    else if (pathname === '/restaurant/create') {
      response.end('This is CREATE page')
    }
    // GET // detail // (/restaurant/id)
    else if (pathname === `/restaurant/${id}`) {
      const restaurants = await getData('rests')
      const restaurant = restaurants.find((rest) => rest.id === id)
      const detail = render('detail', { restaurant })
      response.end(detail)
    }
    // PUT // detail // (/restaurant/id)
    else if (pathname === `/restaurant/${id}` && method === 'PUT') {
      response.end('This is DETAIL page (PUT)')
    }
    // DELETE // detail // (/restaurant/id)
    else if (pathname === `/restaurant/${id}` && method === 'DELETE') {
      response.end('This is DETAIL page (DELETE)')
      response.end(detail)
    }
    // GET // edit // (/restaurant/id/edit)
    else if (pathname === `/restaurant/${id}/edit`) {
      response.end('This is EDIT page')
    }
    // ERROR - 404
    else {
      response.writeHead(404)
      response.end('<h1>Not Found</h1>')
    }
  })
}
