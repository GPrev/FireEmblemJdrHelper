<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('UserStore', ['handleAuthStateChanged']),
    ...mapActions('UserStore', ['firebaseGetUsers']),
    ...mapActions('UnitStore', ['firebaseGetUnits'])
  },
  mounted () {
    // Listen to authentification changes
    this.handleAuthStateChanged()
    // Listen to unit changes
    this.firebaseGetUnits()
    // Listen to user changes
    this.firebaseGetUsers()
  }
}
</script>
