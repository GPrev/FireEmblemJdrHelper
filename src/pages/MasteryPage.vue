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
          max="3"
          color="primary"
        />
      </div>

      <q-btn
        class="absolute-right q-ma-md"
        color="primary"
        :disable="level >= 3"
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
        v-for="(tabName, tabKey) in tabList"
        :key="tabKey"
        :name="tabKey"
        :label="tabName"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-model="tab"
      animated
    >
      <q-tab-panel
        v-for="(tabName, tabKey) in tabList"
        :key="tabKey"
        :name="tabKey"
      >
        <q-list
          bordered
          separator
        >
          <q-item
            clickable
            v-ripple
            v-for="skill in mastery.skills[tabKey]"
            :key="skill"
          >
            <q-item-section>
              <skill-card :skillKey="skill" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'skill-card': require('components/SkillCard.vue').default,
  },
  data () {
    return {
      tab: 'lv1',
      tabList: {
        lv1: 'Débutant',
        lv2: 'Intermédiaire',
        lv3: 'Avancé',
      },
    }
  },
  methods: {
    ...mapActions('UnitStore', ['firebaseUpdateUnit']),
    levelup () {
      let payload = {
        key: this.unit.id,
        unit: {}
      }
      let path = 'masteries/' + this.mastery.id
      payload.unit[path] = this.level + 1
      this.firebaseUpdateUnit(payload)
    },
  },
  computed: {
    ...mapState('UnitStore', ['units']),
    ...mapState('StaticStore', ['masteries', 'skills']),
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
    },
  }
}
</script>

<style>
</style>