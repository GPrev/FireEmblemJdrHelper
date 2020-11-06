<template>
  <div>
    <div class="row text-h5">
      {{unit?unit.name:"???"}}
    </div>
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
  props: ['unit', 'stats', 'valid', 'skills']
}
</script>

<style>
</style>