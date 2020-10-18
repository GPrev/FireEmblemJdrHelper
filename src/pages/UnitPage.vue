<template>
  <unit-card :unit="unit" />
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'unit-card': require('components/UnitCard.vue').default
  },
  computed: {
    ...mapState('UnitStore', ['units']),
    unit () {
      return this.units[this.$route.params.unitID]
    }
  }
}
</script>
