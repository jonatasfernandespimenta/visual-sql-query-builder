import express from 'express'
import pg from 'pg'
import cors from 'cors'
import QueryBuilder from './QueryBuilder.js'
import knex from 'knex';

const { Pool } = pg;

const app = express()
const port = 3000

const database = 'rules';
const schema = 'public';

const pool = new Pool({
  user: 'admin',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database
})

app.use(cors())
app.use(express.json())

app.get('/tables', (req, res) => {
  pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'', (err, result) => {
    if(err) {
      console.log(err);
    }
    res.send(result.rows.filter(row => !row.table_name.includes('migrations')).map((row) => {
      return row.table_name
    }));
  })
})

app.get('/columns/:table', (req, res) => {
  pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${req.params.table}'`, (err, result) => {
    if(err) {
      console.log(err);
    }
    res.send(result.rows.map((row) => {
      return row.column_name
    }));
  })
})

app.post('/', (req, res) => {

  console.log(req.body.items)

  if (!req.body.items || !Array.isArray(req.body.items)) {
    return res.status(400).send('Invalid input');
  }

  const queryBuilder = new QueryBuilder(req.body.items, database, schema, 'postgres');

  const query = queryBuilder.buildQuery();

  console.log(query);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
