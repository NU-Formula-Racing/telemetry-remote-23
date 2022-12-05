class SessionRepository {
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL)`
      return this.dao.run(sql)
    }

    create(name) {
      return this.dao.run(
        'INSERT INTO sessions (name) VALUES (?)',
        [name])
    }

    getById(id) {
      return this.dao.get(
        `SELECT * FROM sessions WHERE id = ?`,
        [id])
    }

    getByName(name) {
      return this.dao.get(
        `SELECT * FROM sessions WHERE name = ?`,
        [name])
    }

    getAll() {
      return this.dao.all(`SELECT * FROM sessions`)
    }

    // session is dictionary: {id, name}
    update(session) {
      const { id, name } = session
      return this.dao.run(
        `UPDATE sessions SET name = ? WHERE id = ?`,
        [name, id]
      )
    }

    delete(id) {
      return this.dao.run(
        `DELETE FROM sessions WHERE id = ?`,
        [id]
      )
    }
  }
  
  module.exports = SessionRepository;