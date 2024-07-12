import fastify from 'fastify';

class rdvResource {
  constructor(business) {
    this.business = business;
    this.app = fastify();
  }

  async getGeoLocationInfo(ipAddress) {
    // Utilisez une API de géolocalisation IP pour obtenir des informations sur la localisation
    // Exemple: https://ipinfo.io/developers
    const apiKey = '640b05222ccc6a';
    const apiUrl = `https://ipinfo.io/${ipAddress}?token=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return data;
  }

  configureRoutes(app) {

    app.addHook('onRequest', (request, reply, done) => {
      const clientIP = request.headers['x-forwarded-for'] || request.ip;
      this.getGeoLocationInfo(clientIP)
        .then((localisation) => {
           console.log('Informations de localisation:', localisation.ip, localisation.city, localisation.region);
        })
        .catch((error) => {
           console.error('Erreur lors de la récupération des informations de localisation:', error.message);
        })
        .finally(() => {
           done();
        });
   });

    app.delete('/api/delete/:id', async (request, reply) => {
      console.log('LOGGER ===========> rdvRessources /delete/:id', ' ----- id = ', request.params.id)
      const res = await this.business.deleteLine(request.params.id);
      reply.send(res);
    });

    app.post('/api/addRdv', async (request, reply) => {
      console.log('LOGGER ===========> rdvRessources /addRdv')
      const rdv = await this.business.addRdv(new Date(request.body.date), request.body.heure, request.body.titre, request.body.adresse, request.body.motif, request.body.idUser);
      reply.send(rdv);
    });

    app.get('/api/getAllRdv/:id', async (request, reply) => {
      console.log(`LOGGER ===========> rdvRessources /getAllRdv -------- id : ${request.params.id} `)
      const result = await this.business.getAllRdv(request.params.id);
      reply.send(result);
    });

    app.get('/api/getRdvByUser/:id', async (request, reply) => {
      console.log(`LOGGER ===========> rdvRessources /getRdvById -------- id : ${request.params.id}`)
      const result = await this.business.getRdvById(request.params.id);
      reply.send(result);
    });

    app.put('/api/updateRdvById/:id', async (request, reply) => {
      console.log(`LOGGER ===========> rdvRessources /updateRdvById -------- id : ${request.params.id}`)
      const result = await this.business.updateRdvById(request.body.titre, request.body.date, request.body.heure, 
        request.body.motif, request.body.adresse, request.params.id);
      reply.send(result);
    });

    app.get('/api/checkUser/:login', async (request, reply) => {
      console.log('LOGGER ===========> rdvRessources /checkUser')
      const result = await this.business.checkUser(request.params.login);
      reply.send(result);
    });

    app.delete('/api/deleteRdv', async (request, reply) => {
      console.log('LOGGER ===========> rdvRessources /deleteRdv')
      const result = await this.business.deleteRdv();
      reply.send(result);
    });

    app.post('/api/createUser', async (request, reply) => {
      console.log('LOGGER ===========> rdvRessources /createUser');
      console.log(request.body)
      const { login, password } = request.body;
      if (!login || !password) {
        reply.status(400).send('All fields are required');
        return;
      }
      try {
        const result = await this.business.createUser(login, password);
        reply.send(result);
      } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        reply.status(500).send('Internal Server Error');
      }
    });

    app.setErrorHandler((error, request, reply) => {
      console.error(error);
      reply.status(500).send('Internal Server Error');
    });
  }
}

export default rdvResource;