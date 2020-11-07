<template>
  <div>
    <div class="row">
      <up-down
        class="col"
        label="PV"
        v-model="hpAndBuffs.hpCur"
        min="0"
        :max="hpAndBuffs.hpMax?hpAndBuffs.hpMax:60"
        editable="true"
      />
      <q-list
        bordered
        class="col-2"
      >
        <q-btn
          flat
          dense
          class="full-height"
          @click="hpAndBuffs.hpCur = hpAndBuffs.hpMax"
        >Max</q-btn>
      </q-list>
    </div>
    <div
      class="row"
      v-for="(statName, statKey) in statNames"
      :key="statKey"
    >
      <up-down
        class="col"
        :label="statName"
        v-model="hpAndBuffs.buffs[statKey]"
        min="-6"
        max="6"
        editable="true"
      />
      <q-list
        bordered
        class="col-2"
      >
        <q-btn
          flat
          class="full-height"
          @click="hpAndBuffs.buffs[statKey] = 0"
        >0</q-btn>
      </q-list>
    </div>
    <q-btn
      color="primary"
      class="full-width q-mt-sm"
      @click="resetBuffs()"
    >Réinit. buffs</q-btn>
  </div>
</template>

<script>
export default {
  components: {
    'up-down': require('components/UpDownField.vue').default
  },
  props: ['value'],
  data () {
    return {
      statNames: {
        str: "FOR",
        mag: "MAG",
        spd: "VIT",
        skl: "TEC",
        def: "DEF",
        res: "RES",
        lck: "CHA",
        mov: "MOV",
      },
    }
  },
  computed: {
    hpAndBuffs: {
      get () {
        return this.value;
      },
      set (val) {
        this.$emit('input', val);
      }
    },
  },
  methods: {
    resetBuffs () {
      Object.keys(this.hpAndBuffs.buffs).forEach(statKey => {
        this.hpAndBuffs.buffs[statKey] = 0
      })
    }
  }
}
</script>

<style>
</style>