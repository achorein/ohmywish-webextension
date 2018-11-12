<template>
    <div>
      <!-- WISH FORM -->
      <form id="wishForm">
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
          <!-- D&eacutetails -->
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Informations compl&eacute;mentaires</label>
            <div class="col-sm-9">
              <textarea class="form-control" name="info" placeholder="super commentaire" cols="35" rows="2" maxlength="255" style="resize: none"
                 v-model="wishModel.info" @keyup="valueChanged('info', wishModel.info)"></textarea>
            </div>
          </div>
        </div>
      </form>
      <!-- WISH FORM ERRORS -->
      <div id="validation-errors" class="alert alert-danger" style="margin-bottom:0" v-if="validationErrors.length > 0">
        <div v-for="error in validationErrors" :key="error">{{ error }}</div>
      </div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faThumbsUp, faChevronDown, faChevronUp, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons'

import { common } from '../../mixins/Common'
import { chromeUtils } from '../../mixins/ChromeUtils'
import { userService } from '../../mixins/UserService'

export default {
  name: 'WishForm',
  mixins: [common, chromeUtils, userService],
  props: {
    wishModel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showMore: false,
      errors: null,
      icons: {happiness: faThumbsUp, down: faChevronDown, up: faChevronUp, lock: faLock, unlock: faUnlock},
      validationErrors: []
    }
  },
  methods: {
    /**
     * Submit form to add a wish
     */
    submitForm() {
      // récupéaration des options de l'extension
      this.storageGet({user: {}}, storage => {
        this.validationErrors = []
        const payload = {
          nom: this.wishModel.nom
        }
        const typeList = this.$store.state.currentListType
        const currentValue = this.$store.state.currentListValue
        let listinfo = null
        // check that a list has been selected (in footer)
        if (typeList === 'follow') {
          if (currentValue && currentValue.indexOf('#') !== -1) {
            listinfo = currentValue.split('#')
            payload.userid = listinfo[1]
          } else if (currentValue === '') {
            this.validationErrors.push('Veuillez choisir une liste de destination')
          } else {
            this.validationErrors.push('Impossible de récupérer la liste de destination')
          }
        } else {
          let currentValue = this.$store.state.currentListValue
          if (currentValue && currentValue.indexOf('#') !== -1) {
            listinfo = currentValue.split('#')
            payload.sharedid = listinfo[1]
          } else if (currentValue === '') {
            this.validationErrors.push('Veuillez choisir une liste de destination')
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
              url += '/'+listinfo[0]+'/'+data.id
            } else if (payload.userid !== storage.user.id) {
              url += '/'+listinfo[0]+'/'+data.id
            } else {
              url += '/'+storage.user.hashcode+'/'+data.id
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
  },
  /**
   * On init actions
   */
  created() {
    // listen on parent event (needed for button click in footer)
    this.$parent.$on('addWish', this.submitForm)
  }
}
</script>