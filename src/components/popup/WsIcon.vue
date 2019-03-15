<template>
  <span class="ws-icon">
    <font-awesome-icon v-if="listInfo.prenom"
      :icon="icons.user" :class="'float-right'" :size="iconSize">
    </font-awesome-icon>
    <font-awesome-icon v-if="!listInfo.prenom"
      :icon="icons.userCircle" :class="'float-right'" :size="iconSize">
    </font-awesome-icon>
    <font-awesome-icon v-if="listInfo.star"
      :icon="icons.star" class="text-warning float-right mr-2" :size="iconSize">
    </font-awesome-icon>
  </span>
</template>

<script>
import { faUser, faUserCircle, faStar } from '@fortawesome/free-solid-svg-icons';
export default {
  name: 'WsIcon',
  props: {
    listInfo: { type: Object, required: true },
    iconSize: {}
  },
  data() {
    return {
      icons: { user: faUser, userCircle: faUserCircle, star: faStar}
    }
  }
}
</script>