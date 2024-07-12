class rdvBusiness {
  constructor(dao, resource) {
    this.dao = dao;
    this.resource = resource;
  }

  async addRdv(date, heure, titre, adresse, motif, idUser) {
    const realDate = new Date(date.setTime(date.getTime() + 1 * 60 * 60 * 1000));
    return this.dao.addRdv(realDate, heure, titre, adresse, motif, idUser);
  }

  async deleteLine(id) {
    return this.dao.deleteLine(id);
  }

  async updateRdvById(titre, date, heure, motif, adresse, id) {
    const toDate = new Date(date)
    const realDate = new Date(toDate.setTime(toDate.getTime() + 1 * 60 * 60 * 1000));
    return this.dao.updateRdvById(titre, realDate, heure, motif, adresse, id);
  }

  async checkUser(login) {
    return this.dao.checkUser(login);
  }

  async getAllRdv(id) {
    await this.deleteRdv()
    const allRdv = await this.dao.getAllRdv(id);
    const result = [];
    allRdv.forEach(element => {
      const split = element.daterdv.split('T')
      const dateEnglish = split[0];
      // Séparation de l'année, du mois et du jour
      const dateFormatee = dateEnglish.split("-");
      var annee = dateFormatee[0];
      var mois = dateFormatee[1];
      var jour = dateFormatee[2];

      // Formatage de la date
      var dateTransformee = jour + "-" + mois + "-" + annee;

      const rdvMap = {
        titre: element.titre,
        date: dateTransformee,
        heure: element.heurerdv,
        adresse: element.adresse,
        motif: element.motif,
        id: element.id,
      };
      result.push(rdvMap);
    });
    return result;
  }

  async deleteRdv() {
    return this.dao.deleteRdv();
  }

  async createUser(login, password) {
    return this.dao.createUser(login, password);
  }

}

export default rdvBusiness;