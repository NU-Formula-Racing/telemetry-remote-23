class DataRepository {
    constructor(dao) {
      this.dao = dao
    }
    
    createTable() {
      // timestamp is in milliseconds
      const sql = `
        CREATE TABLE IF NOT EXISTS data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sensorName TEXT NOT NULL,
          sensorVal REAL NOT NULL,
          timestamp INTEGER NOT NULL, 
          sessionId INTEGER NOT NULL,
          CONSTRAINT data_fk_sessionId FOREIGN KEY (sessionId)
            REFERENCES sessions(id) ON UPDATE CASCADE ON DELETE CASCADE)`
      return this.dao.run(sql)
    }

    create(sensorName, sensorVal, timestamp, sessionId) {
      return this.dao.run(
        `INSERT INTO data (sensorName, sensorVal, timestamp, sessionId)
          VALUES (?, ?, ?, ?)`,
        [sensorName, sensorVal, timestamp, sessionId])
    }

    getBySessionId(sessionId) {
      return this.dao.all(
        `SELECT * FROM data WHERE sessionId = ?`,
        [sessionId])
    }

    getBySensorNameAndSessionId(sensorName, sessionId) {
      return this.dao.all(
        `SELECT * FROM data WHERE sensorName = ? AND sessionId = ?`,
        [sensorName, sessionId])
    }

    getByTimestampRangeAndSessionId(timestampStart, timestampEnd) {
      return this.dao.all(
        `SELECT * FROM data WHERE timestamp >= ? AND timestamp <= ?`,
        [timestampStart, timestampEnd])
    }

    // data is a dictionary: {id, sensorName, sensorVal, timestamp, sessionId}
    update(data) {
      const { id, sensorName, sensorVal, timestamp, sessionId } = data
      return this.dao.run(
        `UPDATE data
        SET sensorName = ?,
          sensorVal = ?,
          timestamp = ?,
          sessionId = ?
        WHERE id = ?`,
        [sensorName, sensorVal, timestamp, sessionId, id]
      )
    }

    deleteBySession(id) {
      return this.dao.run(
        `DELETE FROM sessions WHERE id = ?`,
        [id]
      )
    }

    deleteAll() {
      return this.dao.run(`DELETE FROM data`)
    }
  }
  
  module.exports = DataRepository;


  // code to insert data into data
  
// sessionId needs to be accesssed globally
/*
.then(() => {
  const sensorData = [
    {
      sensorName: 'sensor1',
      sensorVal: 1.01,
      timestamp: Date.now(),
      sessionId: sessionId
    },
    {
      sensorName: 'sensor2',
      sensorVal: 2.02,
      timestamp: Date.now(),
      sessionId: sessionId
    },
  ]
  // treat each dataRepo.create as a promise
  return Promise.all(sensorData.map((data) => {
    const { sensorName, sensorVal, timestamp, sessionId } = data
    return dataRepo.create(sensorName, sensorVal, timestamp, sessionId)
  }))
})
.then(() => sessionRepo.getById(sessionId))
  .then((fetchedSession) => {
    console.log(`\nRetreived session from database`)
    console.log(`session id = ${fetchedSession.id}`)
    console.log(`session name = ${fetchedSession.name}`)
    return dataRepo.getBySessionId(sessionId)
  })
  .then((fetchedData) => {
    console.log(`\nRetreived data from database`)
    fetchedData.forEach((data) => {
      const { sensorName, sensorVal, timestamp, sessionId } = data
      console.log(`sensorName = ${sensorName}`)
      console.log(`sensorVal = ${sensorVal}`)
      console.log(`timestamp = ${timestamp}`)
      console.log(`sessionId = ${sessionId}`)
    })
  })
  .then(() => sessionRepo.deleteAll())
  .then(() => dataRepo.deleteAll())
*/

