import pg from 'pg';

// Utilisation du Pool depuis l'objet pg
const { Pool } = pg;

class rdvDao {
  constructor() {
    this.db = new Pool({
      connectionString: 'postgres://matteo:Dynamo2002@178.16.131.95:5432/rdvDB',
    });
  }

  async deleteLine(id) {
    try {
      const client = await this.db.connect();
      const result = await client.query(`DELETE FROM rdv WHERE id = ${id}`);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async getAllRdv(id) {
    try {
      const client = await this.db.connect();
      const result = await client.query(`SELECT * FROM rdv WHERE idUser = ${id}`);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async updateRdvById(titre, daterdv, heurerdv, motif, adresse, id) {
    try {
      const client = await this.db.connect();
      const query = ('UPDATE rdv SET titre = $1, daterdv = $2, heurerdv = $3, motif = $4, adresse = $5 WHERE id = $6 RETURNING *');
      const values = [titre, daterdv, heurerdv, motif, adresse, id];
      const result = await client.query(query, values);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }


  async getRdvById(id) {
    try {
      const client = await this.db.connect();
      const result = await client.query(`SELECT * FROM rdv WHERE id = ${id}`);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async addRdv(date, heure, titre, adresse, motif, idUser) {
    try {
      const client = await this.db.connect();
      const query = 'INSERT INTO rdv (daterdv, heurerdv, titre, adresse, motif, iduser) VALUES ($1, $2, $3, $4, $5, $6)';
      const values = [date, heure, titre, adresse, motif, idUser];
      const result = await client.query(query, values);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async checkUser(login) {
    try {
      const client = await this.db.connect();
      const result = await client.query(`SELECT * from users where login = '${login}'`);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async deleteRdv() {
    try {
      const client = await this.db.connect();
      const result = await client.query(`DELETE FROM rdv
      WHERE TO_TIMESTAMP(daterdv, 'YYYY-MM-DD"T"HH24:MI:SS.MSS') < CURRENT_TIMESTAMP - INTERVAL '7 days';
      `);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async createUser(login, password) {
    try {
      const client = await this.db.connect();
      const query = 'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING *';
      const values = [login, password];
      const result = await client.query(query, values);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}
export default rdvDao;
