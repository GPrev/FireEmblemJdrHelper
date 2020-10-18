<template>
  <q-page class="flex flex-center">
    <q-list
      bordered
      class="full-width"
    >
      <q-item-label header>Vos personnages</q-item-label>

      <q-item
        v-for="(unit, key) in pcs"
        :key="unit.id"
        class="q-my-sm"
        clickable
        :to="'/unit/' + key"
        v-ripple
      >
        <unit-card
          :unit="unit"
          class="full-width"
        />
      </q-item>

      <q-separator />
      <q-item-label header>Autres personnages</q-item-label>

      <q-item
        v-for="(unit, key) in npcs"
        :key="unit.id"
        class="q-my-sm"
        clickable
        :to="'/unit/' + key"
        v-ripple
      >
        <unit-card
          :unit="unit"
          class="full-width"
        />
      </q-item>

    </q-list>

    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        icon="add"
        color="accent"
        to="/new"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('UserStore', ['userDetails']),
    ...mapState('UnitStore', ['units']),
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
        if (this.units[key].owner !== this.userDetails.userId) {
          unitsFiltered[key] = this.units[key];
        }
      })
      return unitsFiltered
    },
  },
  components: {
    'unit-card': require('components/UnitCard').default
  },
}
</script>
