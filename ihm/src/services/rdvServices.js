import axios from 'axios';

// const baseURL = 'http://localhost:8080';
const baseURL = 'https://apichoisistonrdv.fr';


class rdvServices {
  constructor() {
    this.client = axios.create({
      baseURL: baseURL,
      timeout: 5000, 
    });
  }

  async getAllRdv(id) {
    try {
      const response = await this.client.get(`api/getAllRdv/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des posts : ${error}`);
    }
  }

  async checkUser(login) {
    try {
      const response = await this.client.get(`api/checkUser/${login}`);
      const user = response.data.map(user => user)[0];
      return user;
    } catch (error) {
      throw new Error(`Il n'y a pas de user associé a ce login : ${error}`);
    }
  }

  async addRdv(info) {
    try {
      const response = await this.client.post('api/addRdv', info);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de l'enregistrement du rdv': ${error}`);
    }
  }

  async getRdvById(id) {
    try {
      const response = await this.client.get(`api/getRdvById/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du rdv': ${error}`);
    }
  }

  async updateRdvById(info, id) {
    console.log(info)
    try {
      const response = await this.client.put(`api/updateRdvById/${id}`, info);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la modification du rdv': ${error}`);
    }
  }

  async deleteLine(id) {
    try {
      const response = await this.client.delete(`api/delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du rdv': ${error}`);
    }
  }

  async register(userData) {
    try {
      const response = await this.client.post(`api/createUser`, userData);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de l'ajout du User': ${error}`);
    }
  }

}

export default rdvServices;
