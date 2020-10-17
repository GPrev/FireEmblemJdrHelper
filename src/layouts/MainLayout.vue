<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-btn
          v-if="$route.fullPath != '/'"
          v-go-back.single
          icon="arrow_back"
          flat
          dense
        />

        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  computed: {
    title () {
      let curPath = this.$route.fullPath
      //if(curPath == '/')
      return "Fire Emblem JDR Helper"
    }
  }
}
</script>
