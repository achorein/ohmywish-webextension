<template>
  <div id="messages">
    <div class="alert" v-bind:class="{ 'alert-danger': msg.type === 'error', 'alert-warning': msg.type === 'warning', 'alert-info':  msg.type === 'info', 'alert-success':  msg.type === 'success' }"
      v-for="msg in this.$store.state.messages" :key="msg.text">
      {{msg.text}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Messages',
}
</script>
