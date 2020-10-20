<template>
  <q-item class="q-pa-none q-ma-none">
    <q-item-section avatar>
      <q-avatar
        icon="bluetooth"
        color="primary"
        text-color="white"
      />
    </q-item-section>

    <q-item-section>
      {{skill.name}}
    </q-item-section>

    <q-item-section side>
      <div class="row items-center">
        <q-icon
          name="star"
          color="red"
          size="24px"
        />
        <q-icon
          name="star"
          color="red"
          size="24px"
        />
        <q-icon
          name="star"
          color="red"
          size="24px"
        />
      </div>
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