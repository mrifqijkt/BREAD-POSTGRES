var express = require('express');
var router = express.Router();
var moment = require('moment');

module.exports = function (db) {

  /* GET HOME PAGE */
  router.get('/', (req, res) => {
    const url = req.url == '/' ? '/?page=1' : req.url
    const page = req.query.page || 1
    const limit = 3
    const offset = (page - 1) * limit

    let sql = 'SELECT COUNT(*) AS count FROM bread'
    const params = []
    const sqlsearch = []

    if (req.query.id && req.query.checkboxid) {
      params.push(req.query.id)
      sqlsearch.push(`id = $${params.length}`)
    }

    if (req.query.String && req.query.checkboxString) {
      params.push(`%${req.query.String}%`);
      sqlsearch.push(`String ILIKE $${params.length}`)
    }

    if (req.query.Integer && req.query.checkboxInteger) {
      params.push(req.query.Integer)
      sqlsearch.push(`Integer = $${params.length}`)
    }

    if (req.query.Float && req.query.checkboxFloat) {
      params.push(req.query.Float)
      sqlsearch.push(`Float = $${params.length}`)
    }

    if (req.query.startDate && req.query.endDate && req.query.checkboxDate) {
      params.push(req.query.startDate, req.query.endDate)
      sqlsearch.push(`Date BETWEEN $${params.length - 1} AND $${params.length}`)
    }

    if (req.query.Boolean && req.query.checkboxBoolean) {
      params.push(req.query.Boolean)
      sqlsearch.push(`Boolean = $${params.length}`)
    }

    if (params.length > 0) {
      sql += ` WHERE ${sqlsearch.join(' AND ')}`
    }
    db.query(sql, params, (err, bread) => {
      const pages = Math.ceil(bread.rows.count / limit)
      sql = `SELECT * FROM bread`
      if (params.length > 0) {
        sql += ` WHERE ${sqlsearch.join(' AND ')}`
      }
      params.push(limit, offset)
      sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`
      db.query(sql, params, (err, bread) => {
        if (err) {
          console.error(err)
        } else {
          res.render('index', { bread: bread.rows, pages, page, offset, query: req.query, url, moment })
        }
      })
    })
  })

  // router.get('/Add', (req, res) => {
  //   res.render('add')
  // })

  // router.post('/Add', (req, res) => {
  //   const { String, Integer, Float, Date, Boolean } = req.body
  //   const query = `INSERT INTO bread(String,Integer,Float,Date,Boolean) VALUES ($1,$2,$3,$4,$5)`
  //   const values = [String, Integer, Float, Date, Boolean]

  //   db.query(query, values, (err) => {
  //     if (err) {
  //       console.log(err)
  //     } else {
  //       res.redirect('/')
  //     }
  //   })
  // })

  // router.get('/hapus/:id', (req, res) => {
  //   const id = req.params.id
  //   const query = 'DELETE FROM bread WHERE id = $1'
  //   const values = [id]
  //   db.query(query, [id], function (err) {
  //     if (err) {
  //       console.log(err)
  //     } else {
  //       res.redirect('/')
  //     }
  //   })
  // })

  // router.get('/ubah/:id', (req, res) => {
  //   const id = req.params.id
  //   const query = 'SELECT * FROM bread WHERE id = $1'
  //   const values = [id]

  //   db.query(query, [id], (err, bread) => {
  //     if (err) {
  //       console.error(err)
  //     } else {
  //       res.render('edit', { item: bread.rows[0], moment })
  //     }
  //   })
  // })

  // router.post('/ubah/:id', (req, res) => {
  //   const id = req.params.id
  //   const { String, Integer, Float, Date, Boolean } = req.body
  //   const query = 'UPDATE bread SET String = $1, Integer = $2, FLoat = $3, Date = $4, Boolean = $5 WHERE id = $6 ';
  //   const values = [String, Integer, Float, Date, Boolean, id];

  //   db.query(query, values, function (err) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.redirect('/')
  //     }
  //   })
  // })

  return router;
}