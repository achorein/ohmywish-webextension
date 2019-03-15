<template>
    <div>
      <div class="float-right">
        <b-btn size="sm" :variant="tabIndex == 0 ? 'outline-success' : 'success'" @click="okAction()">
          <span v-if="tabIndex == 0">Suivant</span>
          <span v-else>Enregistrer</span>
        </b-btn>
      </div>
      <b-tabs small v-model="tabIndex">
        <b-tab active>
          <template slot="title">
            <font-awesome-layers full-width class="fa-lg">
              <font-awesome-icon :icon="icons.counter"/>
              <font-awesome-layers-text transform="shrink-6" value="1" />
            </font-awesome-layers> 
            Caractéristiques du souhait
          </template>
          <!-- WISH FORM -->
          <form class="mt-2" id="wishForm">
            <input type="hidden" name="pageid"/>
            <!-- Nom du wish -->
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Nom</label>
              <div class="col-sm-9">
                <input type="text" name="nom" class="form-control" maxlength="255"
                  v-model="wishModel.nom" @keyup="valueChanged('nom', wishModel.nom)"/>
              </div>
            </div>
            <!-- Image(s) -->
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Image</label>
              <div class="col-sm-6">
                <input type="text" name="image" class="form-control" maxlength="1024"
                  v-model="wishModel.image" @keyup="valueChanged('image', wishModel.image)" />
              </div>
              <div class="col-sm-3">
                <img id="image" class="thumb" :src="wishModel.image" v-if="wishModel.image"/>
              </div>
            </div>
            <!-- Lien(s) -->
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Lien</label>
              <div class="col-sm-9">
                <input type="text" name="lien" class="form-control" maxlength="1024"
                  v-model="wishModel.lien" @keyup="valueChanged('lien', wishModel.lien)"/>
              </div>
            </div>
            <!-- Niveau de désir -->
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Niveau de désir</label>
              <div class="col-sm-9">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <font-awesome-icon :icon="icons.happiness" />
                    </span>
                  </div>
                  <input type="number" min="0" max="5" name="happiness" class="form-control" placeholder="Entre 1 et 5" 
                    v-model="wishModel.happiness" @keyup="valueChanged('happiness', wishModel.happiness)"/>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <a id="show-more" class="btn btn-info" v-if="!showMore" @click="showMore=true"><font-awesome-icon :icon="icons.down" /> Plus de caractéristiques</a>
              <a id="show-less" class="btn btn-info" v-if="showMore" @click="showMore=false"><font-awesome-icon :icon="icons.up" /> Moins de caractéristiques</a>
            </div>
            <div id="show-more-content" v-if="showMore">
              <!-- Type de lien -->
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Type de liens</label>
                <div class="col-sm-5"><big>
                  <input type="radio" name="lientype" value="1" checked="checked" 
                    v-model="wishModel.lientype" @keyup="valueChanged('lientype', wishModel.lientype)" /> 
                    <font-awesome-icon :icon="icons.unlock" size="sm" class="ml-1"/> Libre  &nbsp; 
                  <input type="radio" name="lientype" value="2" 
                    v-model="wishModel.lientype" @keyup="valueChanged('lientype', wishModel.lientype)" /> 
                    <font-awesome-icon :icon="icons.lock" size="sm" class="ml-1"/> Stricte 
                </big></div>
              </div>
              <!-- Catégorie -->
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Catégorie</label>
                <div class="col-sm-9">
                    <input type="text" name="category" class="form-control" placeholder="Maison" maxlength="255" 
                      v-model="wishModel.category" @keyup="valueChanged('category', wishModel.category)"/>
                </div>
              </div>
              <!-- Prix -->
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Prix approximatif</label>
                <div class="col-sm-9">
                  <div class="input-group">
                    <div class="input-group-prepend"><span class="input-group-text">&euro;</span></div>
                    <input type="number" min="0" name="prix" class="form-control" placeholder="Prix"
                      v-model="wishModel.prix" @keyup="valueChanged('prix', wishModel.prix)"/>
                  </div>
                </div>
              </div>
              <!-- Détails -->
              <div class="form-group row">
                <label class="col-sm-3 col-form-label">Informations compl&eacute;mentaires</label>
                <div class="col-sm-9">
                  <textarea class="form-control" name="info" placeholder="super commentaire" cols="35" rows="2" maxlength="255" style="resize: none"
                    v-model="wishModel.info" @keyup="valueChanged('info', wishModel.info)"></textarea>
                </div>
              </div>
            </div>
          </form>
        </b-tab>
        <b-tab @click="initList()">
          <template slot="title">
            <font-awesome-layers full-width class="fa-lg">
              <font-awesome-icon :icon="icons.counter"/>
              <font-awesome-layers-text transform="shrink-6" value="2" />
            </font-awesome-layers>  
            Liste de destination
          </template>
          <!-- WISH FORM ERRORS -->
          <div id="validation-errors" class="alert alert-danger" style="margin-bottom:0" v-if="validationErrors.length > 0">
            <div v-for="error in validationErrors" :key="error">{{ error }}</div>
          </div>
          <div class="d-flex flex-row">
            <div class="align-items-center mb-2 mt-2">
              <b-list-group>
                <b-list-group-item href="#" :active="'me' === currentListValue" @click="chooseList('me', true)">
                  <WsImg :listInfo="user"/> {{ user.prenom+' '+user.nom }}
                </b-list-group-item>
              </b-list-group>
            </div>
            <div class="align-items-center flex-fill ml-5">
              <div class="input-group mb-2 mt-2">
                <div class="input-group-prepend"><span class="input-group-text"><font-awesome-icon :icon="icons.filter"/></span></div>
                <input type="text" name="nom" class="form-control" maxlength="255" placeholder="Rechercher une liste"
                  v-model="searchText" @keyup="filterList()"/>
              </div>
            </div>
          </div>
          <b-list-group>
            <b-list-group-item href="#" :active="follow.hashcode+'#'+follow.id === currentListValue"
             v-for="follow in filteredFollowList" :key="follow.hashcode+'#'+follow.id"
             @click="chooseList(follow.hashcode+'#'+follow.id, false)">
              <WsImg :listInfo="follow"/> {{ follow.prenom+' '+follow.nom }}
            </b-list-group-item>
            <b-list-group-item href="#" :active="shared.hashcode+'#'+shared.id === currentListValue"
             v-for="shared in filteredMyList" :key="shared.hashcode+'#'+shared.id"
             @click="chooseList(shared.hashcode+'#'+shared.id, true)">
              <WsImg :listInfo="shared"/> {{ shared.name }}
            </b-list-group-item>
          </b-list-group>
        </b-tab>
      </b-tabs>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown, faChevronUp, faLock, faUnlock, faUser, faUsers, faFilter } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp, faFile, faCircle } from '@fortawesome/free-regular-svg-icons'

import { common } from '../../mixins/Common'
import { chromeUtils } from '../../mixins/ChromeUtils'
import { userService } from '../../mixins/UserService'
import WsImg from './WsImg'

export default {
  name: 'WishForm',
  mixins: [common, chromeUtils, userService],
  components: {
    WsImg
  },
  props: {
    wishModel: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentListType: '',
      currentListValue: '',
      tabIndex: 0,
      searchText: '',
      filteredMyList: [],
      filteredFollowList: [],
      showMore: false,
      errors: null,
      icons: {happiness: faThumbsUp, down: faChevronDown, up: faChevronUp, lock: faLock, unlock: faUnlock, user: faUser, users: faUsers, filter: faFilter, wish: faFile, counter: faCircle},
      validationErrors: []
    }
  },
  methods: {
    initList() {
      this.filteredFollowList = this.$store.state.followList
      this.filteredMyList = this.$store.state.myList
      this.filterList()
    },
    filterList() {
      this.filteredFollowList = this.$store.state.followList.filter(follow => {
        const listText = follow.prenom + ' ' + follow.nom
        return listText.toLowerCase().includes(this.searchText.toLowerCase())
      }) 
      this.filteredMyList = this.$store.state.myList.filter(list => {
        const listText = list.name
        return listText.toLowerCase().includes(this.searchText.toLowerCase())
      })
    },
    chooseList(value, isMine) {
      console.log(`chooseList ${value}|${isMine}`)
      this.currentListValue = value
      this.currentListType = isMine ? 'mine' : 'follow'
      this.validationErrors = []
    },
    okAction() {
      if (this.tabIndex == 0) {
        this.initList()
        this.tabIndex++
      } else {
        this.submitForm()
      }
    },
    /**
     * Submit form to add a wish
     */
    submitForm() {
      // récupéaration des options de l'extension
      this.storageGet({user: this.getDefaultUser()}, storage => {
        this.validationErrors = []
        const payload = {
          nom: this.wishModel.nom
        }
        //const typeList = this.$store.state.currentListType
        //const currentValue = this.$store.state.currentListValue
        let listinfo = null
        // check that a list has been selected
        if (this.currentListType === 'follow') {
          console.log('follow : ' + this.currentListValue)
          if (this.currentListValue && this.currentListValue.indexOf('#') !== -1) {
            listinfo = this.currentListValue.split('#')
            payload.userid = listinfo[1]
          } else if (this.currentListValue === '') {
            this.validationErrors.push('Veuillez choisir une liste de destination')
          } else {
            this.validationErrors.push('Impossible de récupérer la liste de destination')
          }
        } else {
          console.log(`mine (${this.currentListType}): ${this.currentListValue}`)
          // let currentValue = this.$store.state.currentListValue
          if (this.currentListValue && this.currentListValue.indexOf('#') !== -1) {
            listinfo = this.currentListValue.split('#')
            payload.sharedid = listinfo[1]
          } else if (this.currentListValue === '') {
            this.validationErrors.push('Veuillez choisir une liste de destination')
          } else if (this.currentListValue !== 'me') {
            this.validationErrors.push('Impossible de récupérer la liste de destination')
          }
          payload.userid = storage.user.id
        }
        // input validations
        if (!payload.nom || payload.nom === '') {
          this.validationErrors.push('Le nom est obligatoire !')
        }
        var image = this.wishModel.image
        if (image && image.length>6) {
          payload.images = [image]
        }
        var lien = this.wishModel.lien
        if (lien && lien.length>6) {
          payload.links = [lien]
        }
        var lientype = this.wishModel.lientype
        if (lientype) {
          payload.lientype = lientype
        }
        var category = this.wishModel.category
        if (category && category.length > 0) {
          payload.category = category
        }
        var prix = this.wishModel.prix
        if (prix !== '' && prix>=0) {
          payload.prix = prix
        }
        var info = this.wishModel.info
        if (info && info.length>=0) {
          payload.info = info
        }
        var happiness = this.wishModel.happiness
        if (happiness !== '' && happiness>0) {
          payload.happiness = happiness
        }
        if (this.validationErrors.length === 0) {
          console.log(payload)
          // Call API via mixins
          this.addWish(payload).then(response => {
            const data = response.data
            // clean persistent cache (mixins)
            this.storageGet({
              lastinfo: {},
            }, storage => {
              const lastinfo = storage.lastinfo
              const pageid = this.$store.state.pageid
              if (lastinfo[pageid]) {
                lastinfo[pageid] = {}
                // add lastinfo to persistent cache (mixins)
                this.storageSet({
                  lastinfo: lastinfo
                })
              }
            })
            // show result page
            let url='https://www.wishing.space'
            if (payload.sharedid) {
              url += '/'+encodeURIComponent(listinfo[0])+'/'+data.id
            } else if (payload.userid !== storage.user.id) {
              url += '/'+encodeURIComponent(listinfo[0])+'/'+data.id
            } else {
              url += '/'+encodeURIComponent(storage.user.hashcode)+'/'+data.id
            }
            this.$emit('wishAdded', url)
          }).catch(error => {
            this.validationErrors.push('Erreur lors de l\'ajout du souhait : ' + error.response.data.message)
          })
        }
      })
    },
    /**
     * On inputs values changes, persist data
     */
    valueChanged(name, value) {
      // get last info from persistent cache (mixins)
      this.storageGet({lastinfo: {}}, storage => {
        let lastinfo = storage.lastinfo;
        const pageid = this.$store.state.pageid
        console.log('pageid: '+ pageid +', changed : ' + name + ', value: ' + value + ', lastinfo:' + JSON.stringify(lastinfo));
        if (!lastinfo[pageid]) {
          lastinfo[pageid] = {};
        }
        lastinfo[pageid][name] = value;
        // save new last to persistent cache (mixins)
        this.storageSet({
          lastinfo: lastinfo
        });
      });
    }
  }
}
</script>

<style>
 .nav-tabs .nav-link {
   font-weight: bold;
   color: #333 !important;
 }
.nav-tabs .nav-link.active {
   background-color: #fcf8e3 !important;
 }
</style>
