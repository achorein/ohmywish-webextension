<template>
  <div id="app">
    <Header :user="user"></Header>
    <!-- CONTENT -->
    <div class="modal-body pb-0" id="content">
      <Messages></Messages>
      <LoginForm v-if="!connected" :user="user" @userLogged="processCurrentTabPage"></LoginForm>
      <WishForm v-if="connected && !added" :user="user" :wishModel="wishModel" @wishAdded="wishAdded"></WishForm>
      <WishAdded v-if="connected && added" :url="addedUrl"></WishAdded>
    </div>
  </div>
</template>

<script>
import { common } from './mixins/Common';
import { chromeUtils } from './mixins/ChromeUtils';
import { userService } from './mixins/UserService';
import Header from './components/popup/Header.vue';
import Messages from './components/common/Messages.vue';
import WishAdded from './components/popup/WishAdded.vue';
import WishForm from './components/popup/WishForm.vue';
import LoginForm from './components/popup/LoginForm.vue';

export default {
  name: 'app',
  mixins: [chromeUtils, userService, common],
  components: {
    Header,
    Messages,
    WishAdded,
    WishForm,
    LoginForm,
  },
  data() {
    return {
      connected: false,
      user: this.getDefaultUser(),
      added: false,
      addedUrl: null,
      wishModel: { nom: null, lien: null, category: null, prix: null, happiness: null, image: null, info: null },
    };
  },
  methods: {
    /**
     * When extension ready to use (userLogged event), parse the current tab page and fill form
     */
    processCurrentTabPage(user) {
      console.log('Processing current tab page...');
      this.$store.commit('clearMessages'); // mutate store
      this.connected = true;
      // retrieved users lists and follows from API (mixins)
      this.getLists();
      // Get current tab URL (mixins)
      this.getCurrentTab(tab => {
        // get data from persistent cache (mixins)
        this.storageGet(
          {
            lastinfo: {},
          },
          storage => {
            const pageid = this.hashCode(tab.url);
            this.$store.commit('setPageId', pageid); // mutate store
            this.wishModel.nom = this.getDataFromCache('nom', tab.title, storage); // mixins
            this.wishModel.lien = this.getDataFromCache('lien', tab.url, storage); // mixins
            this.wishModel.category = this.getDataFromCache('category', '', storage); // mixins
            this.wishModel.prix = this.getDataFromCache('prix', '', storage); // mixins
            this.wishModel.happiness = this.getDataFromCache('happiness', '', storage); // mixins

            // Parse DOM to get more informations (mixins)
            this.executeScriptOnTab(result => {
              if (!result) {
                console.log('Error while executing script on tab');
                return; // error
              }
              const nom = this.getDataFromCache('nom', result.title, storage); // mixins
              if (nom.length > 0) {
                this.wishModel.nom = nom;
              }
              const imageurl = this.getDataFromCache('image', result.image, storage); // mixins
              if (imageurl.length > 0) {
                this.wishModel.image = imageurl;
              }
              const lien = this.getDataFromCache('lien', result.url, storage); // mixins
              if (lien.length > 0) {
                this.wishModel.lien = lien;
              }
              this.wishModel['info-origin'] = result.description;
              this.wishModel.info = this.getDataFromCache('info', '', storage); // mixins
              console.log('end of tab script');
            });
          },
        );
      });
    },
    /**
     * Handle "wishAdded" event from children
     */
    wishAdded(url) {
      this.added = true;
      this.addedUrl = url;
    },
  },
  /**
   * On init actions (opening extension popup)
   */
  created() {
    console.log('Starting...');
    const that = this;
    // get data from persistent cache (mixins)
    this.storageGet({ user: this.getDefaultUser() }, storage => {
      if (!storage || !storage.user.email || storage.user.email === '') {
        that.showMessage("Avant d'utiliser cette extension vous devez saisir vos identifiants.", 'warning');
      } else {
        console.log('User exists in cache...');
        that.user = storage.user;
        // send signal to LoginForm
        that.$emit('connect', storage.user);
      }
    });
  },
};
</script>

<style>
body {
  width: 768px;
  border: 2px solid var(--dark) !important;
  border-radius: 5px;
  overflow-x: hidden;
}
</style>
