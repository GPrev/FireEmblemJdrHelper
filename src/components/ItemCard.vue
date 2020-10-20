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
      {{item.name}}
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