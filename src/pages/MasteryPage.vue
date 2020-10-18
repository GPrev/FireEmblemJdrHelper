<template>

  <div class="col">

    <q-card class="row items-center">
      <q-avatar class=".col q-ma-sm">
        <img :src="mastery.icon">
      </q-avatar>
      <div class=".col text-h6">{{mastery.name}}</div>

      <div class="col absolute-center">
        <q-rating
          size="18px"
          :value="level"
          :max="3"
          color="primary"
        />
      </div>

      <q-btn
        class="absolute-right q-ma-md"
        color="primary"
        @click="levelup"
      >
        Lv. Up
      </q-btn>
    </q-card>

    <q-separator />

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
        name="lv0"
        label="Débutant"
      />
      <q-tab
        name="lv1"
        label="Intermédiaire"
      />
      <q-tab
        name="lv2"
        label="Avancé"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-model="tab"
      animated
    >
      <q-tab-panel name="lv0">
      </q-tab-panel>

      <q-tab-panel name="lv1">
      </q-tab-panel>

      <q-tab-panel name="lv2">
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      tab: 'lv0'
    }
  },
  methods: {
    ...mapActions('UnitStore', ['firebaseUpdateUnit']),
    levelup () {
      let payload = {
        key: this.unit.id,
        unit: { masteries: {} }
      }
      payload.unit.masteries[this.mastery.id] = this.level + 1
      this.firebaseUpdateUnit(payload)
    }
  },
  computed: {
    ...mapState('UnitStore', ['units']),
    ...mapState('StaticStore', ['masteries']),
    unit () {
      return this.units[this.$route.params.unitID]
    },
    mastery () {
      return this.masteries[this.$route.params.masteryID]
    },
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