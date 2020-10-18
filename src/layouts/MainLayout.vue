<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-btn
          v-if="$route.fullPath != '/' && $route.fullPath != '/auth'"
          v-go-back.single
          icon="arrow_back"
          flat
          dense
        />

        <q-img
          class="absolute-center col-5"
          img-class="my-custom-image"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Fire_Emblem_series_logo.png"
        >
        </q-img>

        <q-btn
          v-if="!userDetails.userId"
          to="/auth"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
          label="Login"
        />
        <q-btn
          v-else
          @click="logoutUser"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
        >
          Logout<br>
          {{ userDetails.name }}
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('UserStore', ['userDetails']),
    title () {
      let curPath = this.$route.fullPath
      //if(curPath == '/')
      return "Fire Emblem JDR Helper"
    }
  },
  methods: {
    ...mapActions('UserStore', ['logoutUser'])
  }
}
</script>

<style lang="stylus">
.q-toolbar {
  .q-btn {
    line-height: 1.2;
  }
}

.my-custom-image {
  filter: brightness(20);
}
</style>