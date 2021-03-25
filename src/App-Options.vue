<template>
  <div id="app">
    <div class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="https://meslistesmagiques.fr" target="_blank"> Mes Listes Magiques</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <p class="navbar-text navbar-right"><b>Extension Options</b></p>
        </div>
      </div>
    </div>
    <div class="container mt-4">
      <UserInfoForm></UserInfoForm>
    </div>
  </div>
</template>

<script>
import UserInfoForm from './components/options/UserInfoForm.vue';
export default {
  name: 'app',
  components: {
    UserInfoForm,
  },
};
</script>
