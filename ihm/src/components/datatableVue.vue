<template>
  <div style="margin-top: 2%; font-size: 5vh;">
    List of all your appointment!
  </div>
  <el-table :data="allRdv" stripe style="width: 100%; margin-top: 3%;">
    <el-table-column label="Date" prop="date" />
    <el-table-column label="Time" prop="heure" />
    <el-table-column label="Title" prop="titre" />
    <el-table-column label="Address" prop="adresse" />
    <el-table-column label="Description" prop="motif" />
    <el-table-column align="right">
      <template #default="scope">
        <!-- <el-button size="small" @click="edit(scope.row)">Modifier</el-button> -->
        <el-button size="small" type="danger" @click="deleteLine(scope.row.id)">Delete</el-button>
        <el-button size="small" @click="genererICS(scope.row)">
          <i class="el-icon-plus"></i> Export
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
  
<script>
import rdvServices from '../services/rdvServices';

export default {
  data() {
    return {
      allRdv: null,
      user: null,
    };
  },
  computed: {
  },
  created() {
    this.rdvServices = new rdvServices();
  },
  async mounted() {
    this.user = JSON.parse(localStorage.getItem('auth'));
    this.allRdv = await this.rdvServices.getAllRdv(this.user.id);
  },
  methods: {
    async edit(row) {
      this.$router.push({
        name: 'ModifierRdv',
        params: { id: row.id },
      });
    },
    genererICS(row) {
      // A changer      changer
      const dtstamp = this.formatDate(new Date());

      // Générer le contenu du fichier .ics
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:MattéoCorp/RDV APP/
BEGIN:VEVENT
UID:${this.generateUniqueId()}
DTSTART;TZID=Europe/Paris:${this.concatDateAndTime(this.convertDateToICalFormat(row.date), this.convertTimeToICalFormat(row.heure))}
DTSTAMP:${dtstamp}
SUMMARY:${this.getTitre(row)}
DESCRIPTION:${this.getMotif(row)}
BEGIN:VALARM
TRIGGER:-P1D
DESCRIPTION:Rappel : ${this.getTitre(row)}
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`

      // Créer et télécharger le fichier .ics
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'rdv.ics';
      link.click();
    },
    concatDateAndTime(dateString, timeString) {
      
      const iCalDateTime = `${dateString}T${timeString}`;

      return iCalDateTime;
    },
    convertTimeToICalFormat(timeString) {
      const split = timeString.split(':')
      const hours = split[0]
      const minutes = split[1]

      // Formater le temps pour le format iCalendar (HHMMSSZ)
      const iCalTime = `${hours}${minutes}00Z`;

      return iCalTime;
    },
    pad(number) {
      return number < 10 ? '0' + number : number;
    },
    convertDateToICalFormat(dateString) {
      const parts = dateString.split('-');
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];

      const iCalDate = `${year}${month}${day}`;
      return iCalDate;
    },
    generateUniqueId() {
      const timestamp = new Date().getTime().toString(16); // Convertir l'horodatage en hexadécimal
      const randomStr = Math.random().toString(16).substr(2, 6); // Chaîne aléatoire hexadécimale
      const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

      // Concaténer les différentes parties pour former l'UID unique
      const uid = timestamp + '-' + randomStr + '-' + guid;

      return uid;
    },
    formatDate(date) {
      // Fonction pour formater la date en format UTC (YYYYMMDDTHHMMSSZ)
      const pad = (n) => (n < 10 ? '0' + n : n);
      return (
        date.getUTCFullYear() +
        pad(date.getUTCMonth() + 1) +
        pad(date.getUTCDate()) +
        'T' +
        pad(date.getUTCHours()) +
        pad(date.getUTCMinutes()) +
        pad(date.getUTCSeconds()) +
        'Z'
      );
    },
    getMotif(row) {
      return row.motif;
    },
    getTitre(row) {
      return row.motif.substring(0, 10);
    },
    getLocation(row) {
      return row.adresse;
    },
    async deleteLine(id) {
      this.$confirm('Voulez-vous vraiment supprimer cet élément?', 'Confirmation', {
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        type: 'warning',
      }).then(async () => {
        await this.rdvServices
          .deleteLine(id)
          .then(() => {
            this.$message({
              message: 'Supression terminé !',
              type: 'success',
              duration: 3000,
              showClose: true,
            })
          })
          .catch((error) => {
            this.$message({
              message: 'Erreur lors de la suppression du rendez-vous !',
              type: 'warning',
              duration: 3000,
              showClose: true,
            })
            console.error(error);
          });
        this.allRdv = await this.rdvServices.getAllRdv(this.user.id);
      })
    }
  },
};
</script>
  
<style scoped>
.data-table {
  margin: 20px;
  text-align: center;
}

/* Styles for the DataTable */
.custom-data-table {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Styles for DataTable headers */
.custom-data-table .p-column-header {
  background-color: #007BFF;
  color: #ffffff;
  text-align: center;
  vertical-align: middle;
}

/* Styles for DataTable rows */
.custom-data-table .p-datatable-tbody>tr:nth-child(odd) {
  background-color: #f5f5f5;
}

/* Styles for DataTable selected rows */
.custom-data-table .p-datatable-tbody>tr.selected-row {
  background-color: #007BFF;
  color: #ffffff;
}

/* Styles for DataTable cells */
.custom-data-table .p-datatable-tbody>tr>td {
  border: 1px solid #ccc;
  /* Ajoute une bordure aux cellules */
}
</style>
  