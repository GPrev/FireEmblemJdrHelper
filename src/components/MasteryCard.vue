<template>
  <q-card
    class="q-py-md q-ma-xs col items-center"
    clickable
    v-ripple
    @click="() => { if(this.unit.owner === this.userDetails.userId) $router.push(this.unit.id + '/training/' + mastery.id) }"
  >
    <div class="row justify-center">
      <q-avatar>
        <img :src="mastery.icon">
      </q-avatar>
    </div>

    <div class="text-center">{{mastery.name}}</div>

    <div class="row justify-center">
      <q-rating
        class="row"
        size="18px"
        :value="level"
        :max="3"
        color="primary"
        readonly
      />
    </div>

  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['unit', 'mastery'],
  computed: {
    ...mapState('UserStore', ['userDetails']),
    level () {
      let level = 0
      if (this.unit.masteries && this.unit.masteries[this.mastery.id]) {
        level = this.unit.masteries[this.mastery.id]
      }
      return level
    }
  }
}
</script>

<style>
</style>