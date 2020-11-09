<template>
  <div>
    <div class="row text-h5">
      {{unit?unit.name:"???"}}
    </div>
    <div
      class="row q-mb-xs items-center"
      v-if="weapon && weapon.name"
    >
      <q-avatar
        class=".col"
        size="xs"
        square
      >
        <img :src="weapon.icon" />
      </q-avatar>
      <div class=".col">{{weapon.name}}</div>
      <div class="col" />
      <q-btn
        class=".col"
        dense
        flat
        round
        color="primary"
        icon="cached"
        size="sm"
        :disable="!(unit.equipment['weapons-1'] && unit.equipment['weapons-1'] !== 'none' && unit.equipment['weapons-2'] && unit.equipment['weapons-2'] !== 'none')"
        @click="swapWeapons()"
      />
    </div>
    <div
      class="row"
      v-else
    >???</div>
    <div class="row">
      <div class="col-6">Dgt</div>
      <div
        :class="'col-3 text-right '+(stats.weak && ' text-positive')"
        v-if="valid"
      >{{stats.mnt}}</div>
      <div
        class="col-3 text-right"
        v-else
      >???</div>
      <div
        class="col-3 text-accent q-px-xs"
        v-if="stats.double"
      >x2</div>
    </div>
    <div class="row">
      <div class="col-6">Hit</div>
      <div
        class="col-3 text-right"
        v-if="valid"
      >{{stats.hit}}</div>
      <div
        class="col-3 text-right"
        v-else
      >???</div>
      <div class="col-3 q-px-xs">%</div>
    </div>
    <div class="row">
      <div class="col-6">Crit</div>
      <div
        class="col-3 text-right"
        v-if="valid"
      >{{stats.crit}}</div>
      <div
        class="col-3 text-right"
        v-else
      >???</div>
      <div class="col-3 q-px-xs">%</div>
    </div>

    <div
      class="row q-mt-xs"
      v-if="valid"
    >
      <q-avatar
        v-for="(skill, skillKey) in skills"
        :key="skillKey"
        size="xs"
      >
        <img :src="skill.icon" />
      </q-avatar>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'unit', 'weapon', 'stats', 'valid', 'skills'],
  computed: {
    weaponSlot: {
      get () {
        return this.value;
      },
      set (val) {
        this.$emit('input', val);
      }
    },
  },
  methods: {
    swapWeapons () {
      if (this.weaponSlot === 'weapons-1') {
        this.weaponSlot = 'weapons-2'
      } else {
        this.weaponSlot = 'weapons-1'
      }
    }
  }
}
</script>

<style>
</style>