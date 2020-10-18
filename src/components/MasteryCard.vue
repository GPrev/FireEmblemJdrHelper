<template>
  <q-card
    class="q-pa-md q-ma-xs"
    clickable
    v-ripple
  >
    <div class="row justify-center">
      <q-avatar>
        <img :src="mastery.icon">
      </q-avatar>
    </div>

    <div class="row justify-center">{{mastery.name}}</div>

    <q-rating
      class="row"
      size="18px"
      v-model="level"
      :max="3"
      color="primary"
    />

  </q-card>
</template>

<script>
export default {
  props: ['unit', 'mastery'],
  computed: {
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