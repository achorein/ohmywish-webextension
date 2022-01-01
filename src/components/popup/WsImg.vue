<template>
  <span class="mr-2">
    <img
      v-if="imgUrl && imgWidth"
      :class="'rounded thumb' + customClass"
      :src="imgUrl"
      :style="{ 'max-width': imgWidth + 'px', 'max-height': imgHeight + 'px' }"
    />
    <img
      v-if="imgUrl && !imgWidth"
      :class="'rounded thumb' + customClass"
      :src="imgUrl"
      :style="{ 'max-width': imgWidth + 'px', 'max-height': imgHeight + 'px' }"
    />
    <font-awesome-icon v-if="icon" :icon="icon" :style="{ 'font-size': imgHeight + 'px', 'vertical-align': 'middle' }" :class="customClass" />
  </span>
</template>

<script>
import { faUserCircle, faGift, faUser } from '@fortawesome/free-solid-svg-icons';
export default {
  name: 'WsImg',
  props: {
    listInfo: { type: Object, required: true },
    image: {},
    imgSize: {},
  },
  data() {
    return {
      imgUrl: null,
      icon: null,
      imgWidth: null,
      imgHeight: null,
      customClass: null,
    };
  },
  /**
   * On init
   */
  created() {
    this.imgWidth = this.imgHeight = this.imgSize ? this.imgSize : 50;
    if (this.listInfo) {
      this.imgUrl = this.listInfo.avatarUrl;
      if (!this.imgUrl) {
        this.icon = this.listInfo.prenom ? faUser : faUserCircle;
      }
    } else if (this.wish) {
      if (this.wish.mainImage && this.wish.mainImage.url) {
        this.imgUrl = this.wish.mainImage.url;
      } else if (this.wish.imagesUrl && this.wish.imagesUrl.length > 0) {
        this.imgUrl = this.wish.imagesUrl[0].url;
      } else if (this.wish.links && this.wish.links.length > 0) {
        this.imgUrl = this.wish.links[0].url;
      } else {
        this.icon = faGift;
        this.customClass = 'text-muted';
        this.imgHeight = this.imgWidth = '32';
      }
    }
  },
};
</script>

<style>
.thumb {
  display: inline-block;
  height: auto;
  background-position: center center;
  background-size: cover;
}
</style>
