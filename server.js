const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const history = require('./api/history')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl
    if (pathname === '/api/history') {
      history(req, res, query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(process.env.PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on ${process.env.PORT}`)
  })
})
