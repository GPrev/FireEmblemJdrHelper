<template>
  <div class="col">
    <unit-card :unit="unit" />

    <q-card>
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
          name="equip"
          label="Equipement"
        />
        <q-tab
          name="train"
          label="Entrainement"
        />
        <q-tab
          name="shop"
          label="Magasin"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab"
        animated
      >
        <q-tab-panel name="equip">
          <div class="text-h6">Mails</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="train">
          <div class="row justify-around">
            <mastery-card
              class="col-3"
              v-for="(mastery, key) in masteries"
              :key="key"
              :unit="unit"
              :mastery="mastery"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="shop">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'unit-card': require('components/UnitCard.vue').default,
    'mastery-card': require('components/MasteryCard.vue').default,
  },
  data () {
    return {
      tab: 'train'
    }
  },
  computed: {
    ...mapState('UnitStore', ['units']),
    ...mapState('StaticStore', ['masteries']),
    unit () {
      return this.units[this.$route.params.unitID]
    }
  }
}
</script>
