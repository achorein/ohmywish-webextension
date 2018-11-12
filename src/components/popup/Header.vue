<template>
    <div class="modal-header panel-heading d-flex">
        <font-awesome-icon :icon="icons.plus" size="2x" class="mr-2 align-self-center" />
        <h4 class="modal-title">Ajouter un souhait</h4>
        <img id="user-avatar" class="rounded ml-auto" v-if="userIcon" :src="userIcon"
            v-b-tooltip.hover placement="bottom"
            :title="'Connecter en tant que ' + user.prenom + ' ' + user.nom"
            height="42"/>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
export default {
    name: 'Header',
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            icons: {plus: faPlus},
            userIcon: null
        }
    },
    methods: {
        /**
         * Compute user icon (gravatar, social, custom)
         */
        computeUserIcon() {
            if (!this.user) { return }
            let url = ''
            let size = 42
            if (this.user.gravstyle === 'social' && this.user.imageurl) {
                url = this.user.imageurl
            } else if (this.user.gravstyle === 'custom') {
                url = 'https://image.wishing.space/user-' + this.user.hashcode + '.jpg'
            } else {
                url = 'http://www.gravatar.com/avatar/'+this.user.gravatar+'?r=pg&d='
                if (this.user.gravstyle) {
                    url += this.user.gravstyle
                } else {
                    url += 'identicon'
                }
                if (size) {
                    url += '&s='+size
                }
            }
            this.userIcon = url
        }
    },
    /**
     * On init actions
     */
    created() {
        // listen on parent event (needed when auth successful in LoginForm component)
        this.$parent.$on('userLogged', this.computeUserIcon)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .modal-header {
        background: #BBDAFF;
        color: #212529
    }
</style>