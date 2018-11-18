<template>
  <span class="mr-2">
   <img v-if="imgUrl && imgWidth" :class="'rounded thumb' + customClass" :src="imgUrl"
    :style="{'max-width': imgWidth + 'px', 'max-height':  imgHeight + 'px'}"/>
   <img v-if="imgUrl && !imgWidth" :class="'rounded thumb' + customClass"
    :src="imgUrl" :style="{'max-width': imgWidth + 'px', 'max-height':  imgHeight + 'px'}"/>
   <font-awesome-icon v-if="icon" :icon="icon"
    :style="{'font-size': imgHeight + 'px', 'vertical-align': 'middle'}"
    :class="customClass"/>
  </span>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserCircle, faGift, faUser } from '@fortawesome/free-solid-svg-icons';
export default {
  name: 'WsImg',
  props: {
    listInfo: { type: Object, required: true },
    image: {},
    imgSize: {},
    gravstyle: {},
    noCache: {}
  },
  data() {
    return {
        imgUrl: null,
        icon: null,
        imgWidth: null,
        imgHeight: null,
        customClass: null,
    }
  },
  /**
   * On init
   */
  created() {
    this.imgWidth = this.imgHeight = this.imgSize?this.imgSize:50;
    if (this.listInfo) {
      if (this.listInfo.name) {
        // sharedlist
        if (this.listInfo.image && this.listInfo.image > 0) {
          this.imgUrl = 'https://image.wishing.space/shared-' + this.listInfo.hashcode + '.jpg';
          if (this.noCache) {
            this.imgUrl += '?cache=' + Date.now();
          }
        } else {
          this.icon = faUserCircle;
        }
      } else if (this.listInfo.prenom) {
        let style = 'identicon';
        if (this.gravstyle) {
          style = this.gravstyle;
        } else if (this.listInfo.gravstyle) {
          style = this.listInfo.gravstyle;
        }
        // person
        if (style === 'social' && this.listInfo.imageurl) {
          this.imgUrl = this.listInfo.imageurl;
        } else if (style === 'custom') {
          if (this.listInfo.image) {
            this.imgUrl = 'https://image.wishing.space/user-' + this.listInfo.hashcode + '.jpg';
            if (this.noCache) {
              this.imgUrl += '?cache=' + Date.now();
            }
          } else {
            this.icon = faUser;
          }
        } else {
          this.imgUrl = 'https://www.gravatar.com/avatar/' + this.listInfo.gravatar + '?r=pg&d=';
          this.imgUrl += (style === 'none') ? 'mm' : style;

          if (this.imgHeight) {
            this.imgUrl += '&s=' + this.imgHeight;
          }
          if ((this.gravstyle && this.gravstyle !== 'none')
              || (!this.gravstyle && this.listInfo.gravstyle && this.listInfo.gravstyle !== 'none')) {
            this.imgUrl += '&f=y';
          }
        }
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
  }
}
</script>

<style>
  .thumb {
    display: inline-block;
    height: auto;
    background-position: center center;
    background-size: cover;
  }
</style>
