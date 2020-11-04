<template>

  <q-card class="full-width">
    <q-expansion-item
      group="unitgroup"
      v-model="expanded"
    >
      <template v-slot:header>
        <q-item-section>
          <unit-card
            v-if="unit"
            :unit="unit"
          />
          <q-item-label v-else>Choisissez une unité</q-item-label>
        </q-item-section>
      </template>

      <q-list
        bordered
        separator
      >
        <q-item
          clickable
          v-ripple
          v-for="(unitVal, unitKey) in units"
          :key="unitKey"
          @click="pick(unitVal, unitKey)"
        >
          <unit-card
            :unit="unitVal"
            class="full-width"
          />
        </q-item>
      </q-list>
    </q-expansion-item>
  </q-card>

</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['value'],
  data () {
    return {
      expanded: false
    }
  },
  computed: {
    ...mapState('UserStore', ['userDetails']),
    ...mapState('UnitStore', ['units']),
    myvalue: {
      get () {
        return this.value;
      },
      set (val) {
        this.$emit('input', val);
      }
    },
    unit () {
      if (this.myvalue && this.units[this.myvalue]) {
        return this.units[this.myvalue]
      }
      else {
        return null
      }
    },
    pcs () {
      let unitsFiltered = {}
      Object.keys(this.units).forEach(key => {
        if (this.units[key].owner === this.userDetails.userId) {
          unitsFiltered[key] = this.units[key];
        }
      })
      return unitsFiltered
    },
    npcs () {
      let unitsFiltered = {}
      Object.keys(this.units).forEach(key => {
        if (this.units[key].owner !== this.userDetails.userId && !this.units[key].hidden) {
          unitsFiltered[key] = this.units[key];
        }
      })
      return unitsFiltered
    },
  },
  methods: {
    pick (unitVal, unitKey) {
      this.myvalue = unitKey
      this.expanded = false
    }
  },
  components: {
    'unit-card': require('components/UnitCard').default
  },
}
</script>

<style>
</style>