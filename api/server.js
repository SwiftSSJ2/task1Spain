import fastify from 'fastify';
import fastifyCors from '@fastify/cors';

import rdvBusiness from './business/rdvBusiness.js';
import rdvDao from './dao/rdvDAO.js';
import rdvResource from './ressources/rdvRessources.js';

const dao = new rdvDao();
const business = new rdvBusiness(dao, rdvResource);
const resource = new rdvResource(business);

const app = fastify();

app.register(fastifyCors, {
  origin: ['https://choisis-ton-rdv.fr', 'http://localhost:3000'],
});

resource.configureRoutes(app);

const listenOptions = {
  port: 8080,
  host: '0.0.0.0',
};

app.listen(listenOptions, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
