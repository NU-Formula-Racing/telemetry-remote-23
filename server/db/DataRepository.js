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
    
    getAll() {
      return this.dao.all(`SELECT * FROM data`)
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
