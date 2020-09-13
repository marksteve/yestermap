import Cors from 'cors';
import { format as formatDate, subYears } from 'date-fns';
import encode from 'encoding-down';
import leveldown from 'leveldown';
import levelup from 'levelup';
import initMiddleware from '../../lib/init-middleware';

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

const db = levelup(encode(leveldown('./db'), { valueEncoding: 'json' }));

export default async (req, res) => {
  await cors(req, res);
  let { date, yearsAgo } = req.query;
  date = date ? new Date(date) : new Date();
  yearsAgo = yearsAgo || 2;
  try {
    res.status(200).json({ history: await getHistory(date, yearsAgo) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function getHistory(date, yearsAgo) {
  return new Promise((resolve, reject) => {
    let history = [];
    db.createValueStream({
      lte: subYears(date, yearsAgo).getTime(),
      reverse: true,
      limit: 5,
    })
      .on('data', (data) => {
        history.push({
          ...data,
          timestamp: formatDate(
            new Date(parseInt(data.timestampMs)),
            'E MMM do, yyyy hh:mm a'
          ),
        });
      })
      .on('end', () => {
        resolve(history);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}
