<template>
  <q-item class="q-pa-none q-ma-none">
    <q-item-section avatar>
      <q-avatar v-if="skill.icon">
        <img :src="skill.icon" />
      </q-avatar>
      <q-avatar
        v-else
        icon="help"
        color="primary"
        text-color="white"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{skill.name}}</q-item-label>
      <q-item-label
        caption
        v-if="skill.description"
      >{{skill.description}}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['skillKey'],
  computed: {
    ...mapState('UserStore', ['userDetails']),
    ...mapState('StaticStore', ['skills']),
    skill () {
      let s = { name: "Aucune" }
      if (this.skills[this.skillKey]) {
        s = this.skills[this.skillKey]
      }
      return s
    }
  },
}
</script>

<style>
</style>