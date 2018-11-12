<template>
    <!-- FOOTER -->
    <div class="modal-footer form-inline m-0 d-flex">
        <!-- WISHLIST FORM -->
        <div id="footer-info" v-if="connected">
          <div>
            <input type="hidden" name="typeList" value="mine">
            <font-awesome-icon :icon="icons.user" size="2x" class="button-cursor" 
              v-bind:class="{ 'text-info': me}"
              v-b-tooltip.hover placement="top" 
              title="Utiliser une liste qui m'appartient"
              @click="changeTypeList(true)"/> 
            <font-awesome-icon :icon="icons.users" size="2x" class="button-cursor ml-1" 
              v-bind:class="{ 'text-info': !me}"
              v-b-tooltip.hover placement="top" 
              title="Utiliser une liste que je suis"
              @click="changeTypeList(false)"/>  &nbsp; 
            <select id="my-list" class="form-control" v-if="me" v-model="listMeId" @change="changeListCurrentValue(listMeId)">
              <option value="">-- Selectionnez une de vos listes --</option>
              <option value="me">Ma liste</option>
              <option v-for="shared in this.$store.state.myList" :key="shared.id"
                :value="shared.hashcode+'#'+shared.id">{{ shared.name }}</option>
            </select> 
            <select id="follow-list" class="form-control" v-model="listFollowId" v-if="!me" @change="changeListCurrentValue(listFollowId)">
              <option value="">-- Selectionnez la liste d'un autre --</option>
              <option v-for="follow in this.$store.state.followList" :key="follow.id"
                :value="follow.hashcode+'#'+follow.id">{{ follow.prenom+' '+follow.nom }}</option>
            </select>
          </div>
        </div>
        <!-- ACTIONS -->
        <div class="ml-auto">
          <button id="close" class="btn btn-default mr-1" @click="close()">Fermer</button>
          <button id="login" class="btn btn-primary" v-if="!connected" @click="$emit('connect')">Se connecter</button>
          <button id="ok" class="btn btn-success" v-else @click="$emit('addWish')"><font-awesome-icon :icon="icons.add"/> Ajouter à la liste</button>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faUsers, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
export default {
  name: 'Footer',
  props: {
    connected: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      me: true,
      listMeId: '',
      listFollowId: '',
      icons: { user: faUser, users: faUsers, add: faCheckCircle }
    }
  },
  methods: {
    /**
     * Handle change list type click
     */
    changeTypeList(isMe) {
      this.me = isMe
      // mutate store (data used by WishForm component)
      if (this.me) {
        this.$store.commit('setCurrentListType', 'me')
      } else {
        this.$store.commit('setCurrentListType', 'follow')
      }
      this.$store.commit('setCurrentListValue', '')
    },
    /**
     * Handle change value for current list
     */
    changeListCurrentValue(newVal) {
      // mutate store (data used by WishForm component)
      this.$store.commit('setCurrentListValue', newVal)
    },
    /**
     * Handle close button click
     */
    close() {
      window.close()
    }
  }
}
</script>
