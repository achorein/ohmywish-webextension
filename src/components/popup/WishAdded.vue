<template>
  <!-- CONTENT ADDED  -->
  <div id="wish-added">
      <h2 class="alert alert-info">
        <font-awesome-icon :icon="icons.happiness" size="2x" class="mr-4"/> 
        Le souhait a bien été ajouté à liste !
      </h2>
      <h3 class="mb-5">
        Pour consulter la liste associée <a :href="url" target="_blank" id="wish-added-link">cliquez ici</a>.
      </h3>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
export default {
  name: 'WishAdded',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      icons: { happiness: faThumbsUp}
    }
  }
}
</script>
