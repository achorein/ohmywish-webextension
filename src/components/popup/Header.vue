<template>
    <div class="modal-header panel-heading d-flex">
        <font-awesome-icon :icon="icons.plus" size="2x" class="mr-2 align-self-center" />
        <h4 class="modal-title">Ajouter un souhait</h4>
        <WsImg :listInfo="user" size="42" v-if="user.prenom"
            v-b-tooltip.hover placement="bottom"
            :title="'Connecter en tant que ' + user.prenom + ' ' + user.nom"/>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { common } from '../../mixins/Common'

import WsImg from './WsImg'

export default {
    name: 'Header',
    mixins: [common],
    components: {
        WsImg
    },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            icons: {plus: faPlus}
        }
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