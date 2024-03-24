// MODULE
const http = require('http')
const url = require('url')
// MIDDLEWARE
const Middleware = require('./utility/middleware')
const middleware = new Middleware()
const static = middleware.static('public')
const methodOverride = middleware.methodOverride()
// TEMPLATE ENGINE
const render = require('./utility/template-engine')
// SEEDER
// const restaurants = require('./public/json/restaurants.json').results
const db = require('./mysql')
// SERVER
const server = http.createServer()
const host = 'localhost'
const port = 3000
server.on('request', requestListener)
server.listen(port, () => console.log(`http://${host}:${port}`))
// DATABASE
const database = 'rest'
// TABLE
const table = 'rests'
module.exports = { database, table }

function requestListener(request, response) {
  const url = new URL(request.url, `http://${host}:${port}`)
  const urlParams = url.searchParams
  const pathname = url.pathname
  const id = Number(pathname.match(/\d+/g))
  const method = request.method
  response.setHeader('Access-Control-Allow-Origin', '*')
  static(request, response, async () => {
    methodOverride(request, response, async (postData) => {
      // GET // root // (/)
      if (pathname === '/' && request.method === 'GET') {
        response.writeHead(302, { Location: '/restaurants' })
        response.end('<h1>This is the root</h1>')
      }
      // GET // index // (/restaurants)
      else if (pathname === '/restaurants' && request.method === 'GET') {
        const restaurants = await db.getData(table)
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
      // GET // create // (/restaurant/create)
      else if (pathname === '/restaurant/create' && request.method === 'GET') {
        const create = render('create')
        response.end(create)
      }
      // GET // detail // (/restaurant/id)
      else if (pathname === `/restaurant/${id}` && request.method === 'GET') {
        const restaurants = await db.getData(table)
        const restaurant = restaurants.find((rest) => rest.id === id)
        const editDelete = true
        const detail = render('detail', { restaurant, editDelete })
        response.end(detail)
      }
      // GET // edit // (/restaurant/id/edit)
      else if (pathname === `/restaurant/${id}/edit` && request.method === 'GET') {
        const restaurants = await db.getData(table)
        const restaurant = restaurants.find((rest) => rest.id === id)
        const edit = render('edit', { restaurant })
        response.end(edit)
      }
      // POST // index // (/restaurants)
      else if (pathname === '/restaurants' && request.method === 'POST') {
        db.insertRow(table, postData)
        response.writeHead(302, { Location: '/restaurants' })
        response.end('This is INDEX page (POST)')
      }
      // PUT // detail // (/restaurant/id)
      else if (pathname === `/restaurant/${id}` && request.method === 'PUT') {
        db.updateRow(table, postData, id)
        response.writeHead(302, { Location: `/restaurant/${id}` })
        response.end('This is DETAIL page (PUT)')
      }
      // DELETE // detail // (/restaurant/id)
      else if (pathname === `/restaurant/${id}` && request.method === 'DELETE') {
        db.deleteRow(table, id)
        response.writeHead(302, { Location: `/restaurants` })
        response.end('This is DETAIL page (DELETE)')
      }
      // ERROR - 404
      else {
        response.writeHead(404)
        response.end('<h1>Not Found</h1>')
      }
    })
  })
}
