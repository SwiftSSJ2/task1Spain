<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div style="margin-top: 2%; font-size: 5vh;">
    Fill the information to get your appointment!
  </div>
  <div>
    <el-form ref="form" :model="form" label-width="120px" style="margin-top: 4%; margin-left: 2%; margin-right: 2%;"
      :label-position="'top'">
      <el-form-item label="Title">
        <el-input v-model="form.titre" placeholder="Subject of your appointment" />
        <div v-if="submitForm && !form.titre" slot="error" class="error-message" style="color: red;">the field is required.</div>
      </el-form-item>
      <el-form-item label="Date and time">
        <el-col :span="11">
          <el-date-picker v-model="form.date" type="date" placeholder="Pick a date" style="width: 100%"
            format="DD/MM/YYYY" />
          <div v-if="submitForm && !form.date" slot="error" class="error-message" style="color: red;">the field is required.</div>
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.heure" type="hour" placeholder="Choose the time" style="width: 100%" />
          <div v-if="submitForm && !form.heure" slot="error" class="error-message" style="color: red;">the field is required.</div>
        </el-col>
      </el-form-item>
      <el-form-item label="Addresse">
        <el-input v-model="form.adresse" placeholder="Addresse of your appointment" />
        <div v-if="submitForm && !form.adresse" slot="error" class="error-message" style="color: red;">the field is required.</div>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.motif" type="textarea" placeholder="Description of your appointment" />
        <div v-if="submitForm && !form.motif" slot="error" class="error-message" style="color: red;">the field is required.</div>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="btnDisabled" type="primary"
          @click="onSubmit">Save</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import rdvServices from '../services/rdvServices';


export default {
  data() {
    return {
      form: {
        titre: '',
        date: '',
        heure: '',
        adresse: '',
        motif: '',
      },
      submitForm: false,
      btnDisabled: false,
    };
  },
  async created() {
    this.rdvServices = new rdvServices();
  },
  async mounted() {
    if (this.$route.params.id) {
      const rdvDetails = await this.rdvServices.getRdvById(this.$route.params.id)
      if (rdvDetails) {
        this.form.titre = rdvDetails[0].titre || '';
        this.form.date = rdvDetails[0].daterdv || '';
        this.form.heure = rdvDetails[0].heurerdv || '';
        this.form.adresse = rdvDetails[0].adresse || '';
        this.form.motif = rdvDetails[0].motif || '';
      }
    }
  },
  methods: {
    async edit() {
      this.btnDisabled = true;
      await new Promise(r => setTimeout(r, 2000));
      const newDate = new Date(this.form.date);
      this.form.date = newDate;
      this.$confirm('Voulez-vous vraiment modifier cet élément?', 'Confirmation', {
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        type: 'warning',
      }).then(async () => {
        await this.rdvServices
          .updateRdvById(this.form, this.$route.params.id)
          .then(() => {
            this.$message({
              message: 'Modification terminé !',
              type: 'success',
              duration: 3000,
              showClose: true,
            })
            this.$router.push(`/`);
          })
          .catch((error) => {
            this.$message({
              message: 'Erreur lors de la modification du rendez-vous !',
              type: 'warning',
              duration: 3000,
              showClose: true,
            })
            console.error(error);
          });
      })
      this.btnDisabled = false;
    },
    returnMenu() {
      this.$router.push(`/`);
    },
    checkInput() {
      if (!(this.form.titre && this.form.heure && this.form.date && this.form.adresse && this.form.motif)) {
        return false;
      }
      return true;
    },
    pad(number) {
      return number < 10 ? '0' + number : number;
    },
    async onSubmit() {
      const maDate = this.form.heure;

      // Obtenir l'heure, les minutes et les secondes
      const heures = maDate.getHours();
      const minutes = maDate.getMinutes();
      const secondes = maDate.getSeconds();

      // Formater l'heure comme une chaîne (HH:MM:SS)
      const heureFormatee = `${this.pad(heures)}:${this.pad(minutes)}:${this.pad(secondes)}`;

      // Diviser la chaîne d'heure en heures, minutes et secondes
      const [heures1, minutes1, secondes1] = heureFormatee.split(':');

      // Formater l'heure pour le format iCalendar (HHMMSSZ)
      const iCalTime = `${heures1}${minutes1}${secondes1}Z`;

      // Fonction utilitaire pour ajouter un zéro devant les nombres < 10
      this.btnDisabled = true;
      await new Promise(r => setTimeout(r, 2000));
      this.submitForm = true;
      this.user = JSON.parse(localStorage.getItem('auth'))
      if (this.checkInput()) {

        const objForm = {
          titre: this.form.titre,
          date: new Date(this.form.date),
          heure: iCalTime,
          adresse: this.form.adresse,
          motif: this.form.motif,
          idUser: this.user.id,
        }
        this.rdvServices
          .addRdv(objForm)
          .then(() => {
            this.$message({
              message: 'Enregistement effectué !',
              type: 'success',
              duration: 3000,
              showClose: true,
            })
            this.$router.push(`/`);
          })
          .catch((error) => {
            this.$message({
              message: 'Erreur lors de l\'enregistrement du rendez-vous !',
              type: 'warning',
              duration: 3000,
              showClose: true,
            })
            console.error(error);
          })
      } else {
        this.$message({
          message: 'Tous les champs ne sont pas remplis !',
          type: 'warning',
          duration: 3000,
          showClose: true,
        })
      }
      await new Promise(r => setTimeout(r, 2000));
      this.btnDisabled = false;
    },
  },
};
</script>

<style scoped>
.ajouter-rdv {
  margin: 20px;
}
</style>