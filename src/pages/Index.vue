<template>
  <q-page class="flex">

    <div class="full-width">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          name="units"
          label="Unités"
        />
        <q-tab
          name="battle"
          label="Combat"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab"
        animated
      >

        <q-tab-panel
          name="units"
          class="q-px-none"
        >
          <q-list bordered>
            <q-item-label header>Vos personnages</q-item-label>

            <q-item
              v-for="(unit, key) in pcs"
              :key="unit.id"
              class="q-my-sm"
              clickable
              :to="'/unit/' + key"
              v-ripple
            >
              <q-menu
                touch-position
                context-menu
              >
                <q-list
                  dense
                  style="min-width: 100px"
                >
                  <q-item
                    clickable
                    :to="'/unit/' + key + '/edit'"
                  >
                    <q-item-section>Modifier...</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
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
        </q-tab-panel>

        <q-tab-panel name="battle">
          <battle-sim />
        </q-tab-panel>

      </q-tab-panels>
    </div>

    <q-page-sticky
      v-if="tab === 'units'"
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
  data () {
    return {
      tab: 'units'
    }
  },
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
        if (this.units[key].owner !== this.userDetails.userId && !this.units[key].hidden) {
          unitsFiltered[key] = this.units[key];
        }
      })
      return unitsFiltered
    },
  },
  components: {
    'unit-card': require('components/UnitCard').default,
    'battle-sim': require('components/BattleSim').default
  },
}
</script>
