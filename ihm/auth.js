// auth.js
import md5 from 'md5';
import rdvServices from './src/services/rdvServices';

// Fonction pour vérifier l'authentification
export async function checkAuthentication(username, password) {
  const rdvServ = new rdvServices();
  const user = await rdvServ.checkUser(username);

  if (md5(password) === user.password) {
    const authInfo = user;
    return authInfo;
  } else {
    return false;
  }
}
