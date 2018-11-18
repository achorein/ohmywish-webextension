<!-- Component used for log in -->
<template>
  <div>
    <p class="notice">
      Pour utiliser cette extension, veux devez disposer d'un compte sur le site <a href="https://www.wishing.space" target="_blank">wishing.space</a>.
    </p>
    <form name="infoForm">
      <div class="form-group row">
          <!-- Login -->
          <label class="col-sm-3 col-form-label">Adresse e-mail</label>
          <div class="input-group col-sm-7">
              <div class="input-group-prepend"><span class="input-group-text">@</span></div>
              <input type="email" name="email" v-model="user.email" @keyup.enter="connect()"
                placeholder="monadresse@mail.com" class="form-control"/>
          </div>
      </div>
      <div class="form-group row">
          <!-- Password -->
          <label class="col-sm-3 col-form-label">Mot de passe</label>
          <div class="input-group col-sm-7">
            <input type="password" name="password" v-model="user.password" @keyup.enter="connect()"
              placeholder="mon mot de passe" class="form-control"/>
          </div>
      </div>
    </form>
    <button class="btn btn-primary" @click="connect(user)">Se connecter</button>
  </div>
</template>

<script>
import axios from 'axios'
import { common } from '../../mixins/Common'
import { chromeUtils } from '../../mixins/ChromeUtils'
import { userService } from '../../mixins/UserService'
export default {
  name: 'LoginForm',
  mixins: [common, chromeUtils, userService],
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    /**
     * Triggered when a connection is asked (auto-connect or user button)
     * @param user is passed when auto-connect from cache
     */
    connect(user) {
      if (!user) {
        console.log('Try to connect using form...' + JSON.stringify(this.user.email))
        this.clearMessages();
        if (!this.user.email || this.user.email === '') {
          this.showError('Le champ adresse e-mail est requis !')
        } else if (this.user.email.indexOf('@') === -1 || this.user.email.indexOf('.') === -1) {
          this.showError('L\'adresse email n\'est pas valide !')
        } else if (!this.user.password || this.user.password === '') {
          this.showError('Le champ mot de passe est requis !')
        } else {
          this.checkConnexion(this.user)
        }
      } else {
        this.checkConnexion(user)
      }
    },
    /**
     * Check if the user is alreary logged in
     * @param user the user to authentificate
     */
    checkConnexion(user) {
      console.log('Check if user is already auhtentificated...')
      this.showMessage('Chargement...')
      // Call API via mixins
      this.checkAuth().then(response => {
        if (response.data.logged !== 1) {
          // need new login
          this.login(user)
        } else {
          // already logged in
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token
          this.$emit('userLogged', user)
        }
      })
      .catch(error => {
        this.clearMessages();
        console.log(error.response)
        if(error.response.status === 401) { // session expired
          this.login()
        } else {
          this.showError('Erreur lors du l\'authentification : ' + error.response.data.message)
        }
      })
    },
    login(user) {
      console.log('Ask for new auhtentification...')
      // Call API via mixins
      this.loginUser(user).then(response => {
        // copy all attributes from API response
        for(let key in response.data) user[key] = response.data[key]
        const that = this // for storage callback
        this.storageSet({user: user}, _ => {
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token
          that.$emit('userLogged', user)
        });
      })
      .catch(error => {
        this.clearMessages()
        console.log(error.response.data)
        this.showError('Erreur lors de la connexion : ' + error.response.data.message)
      })
    }
  },
  /**
   * On init actions
   */
  created() {
    // listen on parent event (needed for autoconnect)
    this.$parent.$on('connect', this.connect);
  }
}
</script>

<style scoped>
.notice {
  font-style: italic;
}
</style>
