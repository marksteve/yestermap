const Cors = require('cors')
const { format: formatDate, subYears } = require('date-fns')
const encode = require('encoding-down')
const leveldown = require('leveldown')
const levelup = require('levelup')
const initMiddleware = require('../lib/init-middleware')

const db = levelup(encode(leveldown('./db'), { valueEncoding: 'json' }))
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

module.exports = async (req, res, query) => {
  await cors(req, res)
  res.setHeader('Content-Type', 'application/json')
  let { date, yearsAgo } = query
  date = date ? new Date(date) : new Date()
  yearsAgo = yearsAgo || 2
  try {
    res.statusCode = 200
    res.end(JSON.stringify({ history: await getHistory(date, yearsAgo) }))
  } catch (err) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: err.message }))
  }
}

function getHistory(date, yearsAgo) {
  return new Promise((resolve, reject) => {
    let history = []
    db.createValueStream({
      lte: subYears(date, yearsAgo).getTime(),
      reverse: true,
      limit: 10,
    })
      .on('data', (data) => {
        history.push({
          ...data,
          timestamp: formatDate(
            new Date(parseInt(data.timestampMs)),
            'E MMM do, yyyy hh:mm a'
          ),
        })
      })
      .on('end', () => {
        resolve(history)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}
