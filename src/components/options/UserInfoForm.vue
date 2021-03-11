<template>
  <div>
    <div class="rounded options-content">
      <h2 id="info" class="mt-0">
        <font-awesome-icon :icon="icons.info" />
        Mes informations de connexion
      </h2>
      <p class="alert alert-info">
        Pour utiliser cette extension un compte est nécessaire sur le site
        <a href="https://meslistesmagiques.fr" target="_blank">Mes Listes Magiques</a>.
      </p>
      <Messages></Messages>
      <form name="infoForm">
        <div class="form-group row">
          <label class="col-sm-3 control-label">Adresse e-mail</label>
          <div class="input-group col-sm-7">
            <div class="input-group-prepend"><span class="input-group-text">@</span></div>
            <input type="email" name="email-wishspace" v-model="email" autocomplete="false" placeholder="monadresse@mail.com" class="form-control" />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-3 control-label">Mot de passe</label>
          <div class="input-group col-sm-7">
            <input
              type="password"
              name="password-wishspace"
              v-model="password"
              autocomplete="false"
              placeholder="mon mot de passe"
              class="form-control"
            />
          </div>
        </div>
      </form>
    </div>
    <div>
      <button class="btn btn-primary float-right" @click="save()">Sauvegarder</button>
      <button class="btn btn-danger" @click="reinit()">Reinitialiser</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import { common } from '../../mixins/Common';
import { chromeUtils } from '../../mixins/ChromeUtils';
import { userService } from '../../mixins/UserService';

import Messages from '../common/Messages.vue';

export default {
  name: 'UserInfoForm',
  mixins: [common, chromeUtils, userService],
  components: {
    Messages,
  },
  data() {
    return {
      email: null,
      password: null,
      icons: { info: faSignInAlt },
    };
  },
  methods: {
    /**
     * Hadnle save button click
     */
    save() {
      this.clearMessages();
      if (!this.email || this.email === '') {
        this.showError('Le champ adresse e-mail est requis !');
        return;
      } else if (this.email.indexOf('@') === -1 || this.email.indexOf('.') === -1) {
        this.showError("L'adresse email n'est pas valide !");
        return;
      } else if (!this.password || this.password === '') {
        this.showError('Le champ mot de passe est requis !');
        return;
      }
      const that = this;
      // Call API via mixins to validate account and get token
      this.loginUser({ username: this.email, password: this.password })
        .then(response => {
          let user = response.data;
          user.email = that.email;
          user.password = that.password;
          this.storageSet({ user: user }, _ => {
            this.showMessage("Identifiants sauvegardés, vous pouvez maintenant fermer cette page et utiliser l'extension !", 'success');
          });
        })
        .catch(error => {
          this.showError(error.response.data.message);
        });
    },
    /**
     * Reset account informations
     */
    reinit() {
      this.clearMessages();
      // clean persistent cache (mixins)
      this.storageSet({ user: this.getDefaultUser() }, _ => {
        this.showMessage("Identifiants réinitialisés, vous n'êtes plus connecté !", 'success');
      });
      this.email = null;
      this.password = null;
    },
  },
  /**
   * On init actions
   */
  created() {
    // get persistent cache data (mixins)
    this.storageGet({ user: this.getDefaultUser() }, storage => {
      this.email = storage.user.email;
      this.password = storage.user.password;
    });
  },
};
</script>

<style scoped>
.notice {
  font-style: italic;
}
</style>
