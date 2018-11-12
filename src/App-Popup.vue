<template>
  <div id="app">
    <Header :user="user"></Header>
    <!-- CONTENT -->
    <div class="modal-body pb-0" id="content">
      <Messages></Messages>
      <LoginForm v-if="!connected" :user="user" @userLogged="processCurrentTabPage"></LoginForm>
      <WishForm v-if="connected && !added" :wishModel="wishModel" @wishAdded="wishAdded"></WishForm>
      <WishAdded v-if="connected && added" :url="addedUrl"></WishAdded>
    </div>
    <Footer :connected="connected" @connect="connect" @addWish="addWish" v-if="!added"></Footer>
  </div>
</template>

<script>
import axios from 'axios'
import { common } from './mixins/Common'
import { chromeUtils } from './mixins/ChromeUtils'
import { userService } from './mixins/UserService'
import Header from './components/popup/Header.vue'
import Messages from './components/common/Messages.vue'
import WishAdded from './components/popup/WishAdded.vue'
import WishForm from './components/popup/WishForm.vue'
import LoginForm from './components/popup/LoginForm.vue'
import Footer from './components/popup/Footer.vue'

export default {
  name: 'app',
  mixins: [chromeUtils, userService, common],
  components: {
    Header,
    Messages,
    WishAdded,
    WishForm,
    LoginForm,
    Footer
  },
  data() {
    return {
      connected: false,
      user: {},
      added: false,
      addedUrl: null,
      wishModel: {nom: null, lien: null, category: null, prix: null, happiness: null, image: null, info: null}
    }
  },
  methods: {
    /**
     * When extension ready to use (userLogged event), parse the current tab page and fill form
     */
    processCurrentTabPage() {
      console.log('Processing current tab page...')
      this.$emit('userLogged', this.user) // send to all children (Header component)
      this.$store.commit('clearMessages') // mutate store
      this.connected = true
      // retrieved users lists and follows from API (mixins)
      this.getLists()
      // Get current tab URL (mixins)
      this.getTabs(tabs => {
        const tab = tabs[0];
        // get data from persistent cache (mixins)
        this.storageGet({
          lastinfo: {},
        }, storage => {
          const pageid = this.hashCode(tab.url)
          this.$store.commit('setPageId', pageid) // mutate store
          this.wishModel.nom = this.getDataFromCache('nom', tab.title, storage) // mixins
          this.wishModel.lien = this.getDataFromCache('lien', tab.url, storage) // mixins
          this.wishModel.category = this.getDataFromCache('category', '', storage) // mixins
          this.wishModel.prix = this.getDataFromCache('prix', '', storage) // mixins
          this.wishModel.happiness = this.getDataFromCache('happiness', '', storage) // mixins

          // Parse DOM to get more informations (mixins)
          this.executeScriptOnTab(results => {
              if (!results) {
                  return; // error
              }
              const result = results[0];
              const nom = this.getDataFromCache('nom', result.title, storage); // mixins
              if (nom.length>0) {
                this.wishModel.nom = nom;
              }
              const imageurl = this.getDataFromCache('image', result.image, storage); // mixins
              if (imageurl.length > 0) {
                this.wishModel.image = imageurl
              }
              const lien = this.getDataFromCache('lien', result.url, storage); // mixins
              if (lien.length > 0) {
                this.wishModel.lien = lien
              }
              this.wishModel['info-origin'] = result.description
              this.wishModel.info = this.getDataFromCache('info', '', storage) // mixins
              console.log("end of tab script")
          })
        })
      })
    },
    /**
     * Handle "wishAdded" event from children
     */
    wishAdded(url) {
      this.added = true;
      this.addedUrl = url
    },
    /**
     * Handle "connect" event from children
     */
    connect() {
      // send signal to all children (LoginForm)
      this.$emit('connect')
    },
    /**
     * Handle "addWish" event from children
     */
    addWish() {
      // send signal to all children (WishForm)
      this.$emit('addWish')
    }
  },
  /**
   * On init actions (opening extension popup)
   */
  created() {
    console.log('Starting...')
    const that = this
    // get data from persistent cache (mixins)
    this.storageGet({ user: {} }, 
      storage => {
        if (!storage || !storage.user.email || storage.user.email === '') {
          that.showMessage('Avant d\'utiliser cette extension vous devez saisir vos identifiants.', 'warning')
        } else {
          console.log('User exists in cache...')
          that.user = storage.user
          // send signal to LoginForm
          that.$emit('connect', storage.user)
        }
      }
    )
  }
}
</script>

<style lang="scss">
@import '../node_modules/bootstrap/scss/bootstrap.scss';
@import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';
@import './assets/app.scss';
</style>
<style>
body {
    width: 768px; 
    border: 2px solid #FFFFC8 !important;
    border-radius: 5px;
    overflow-x: hidden;
}
</style>
