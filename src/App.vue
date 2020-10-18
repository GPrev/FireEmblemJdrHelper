<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('UserStore', ['handleAuthStateChanged', 'firebaseGetUsers']),
    ...mapActions('UnitStore', ['firebaseGetUnits']),
    ...mapActions('StaticStore', ['firebaseGetMasteries', 'firebaseGetSkills'])
  },
  mounted () {
    // Listen to authentification changes
    this.handleAuthStateChanged()
    // Listen to unit changes
    this.firebaseGetUnits()
    // Listen to user changes
    this.firebaseGetUsers()
    // Listen to static changes (should be only once)
    this.firebaseGetMasteries()
    this.firebaseGetSkills()
  }
}
</script>
