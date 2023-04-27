const sqlite3 = require('sqlite3')
const Promise = require('bluebird')

// data access object
// configures the database connection for interacting with local sqlite instance
// used for temporary storage of data from sensors
// can persist session data if even client or server is closed/restarted
class DAO {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('DAO: Could not connect to database', err)
      } else {
        console.log('DAO: Connected to database at ' + dbFilePath)
      }
    })
    this.db.run('PRAGMA foreign_keys = ON')
  }

  // encapsulate sqlite3 run() under bluebird promise 
  // returns the id of the last inserted row
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log('DAO: Error running sql run():' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
    })
  }

  // encapsulate sqlite3 get() under bluebird promise 
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log('DAO: Error running sql get(): ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  // encapsulate sqlite3 all() under bluebird promise
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log('DAO: Error running sql all(): ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  

}

module.exports = DAO