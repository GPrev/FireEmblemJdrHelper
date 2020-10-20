<template>
  <q-item class="q-pa-none q-ma-none">
    <q-item-section avatar>
      <q-avatar
        v-if="item.icon"
        square
      >
        <img :src="item.icon" />
      </q-avatar>
      <q-avatar
        v-else
        icon="help"
        color="primary"
        text-color="white"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{item.name}}</q-item-label>
      <q-item-label
        caption
        v-if="itemType == 'weapons' && item.atk"
      >ATQ {{item.atk}} PRC {{item.hit}}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['itemType', 'itemKey'],
  computed: {
    ...mapState('UserStore', ['userDetails']),
    ...mapState('StaticStore', ['items']),
    item () {
      let i = { name: "Aucune" }
      if (this.items[this.itemType] && this.items[this.itemType][this.itemKey]) {
        i = this.items[this.itemType][this.itemKey]
      }
      return i
    }
  },
}
</script>

<style>
</style>