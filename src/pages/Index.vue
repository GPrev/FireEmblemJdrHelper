<template>
  <q-page class="flex flex-center">
    <q-list
      bordered
      class="full-width"
    >
      <q-item-label header>Vos personnages</q-item-label>

      <q-item
        v-for="unit in pcs"
        :key="unit.id"
        class="q-my-sm"
        clickable
        to="/unit"
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
        v-for="unit in npcs"
        :key="unit.id"
        class="q-my-sm"
        clickable
        v-ripple
      >
        <unit-card
          :unit="unit"
          class="full-width"
        />
      </q-item>

    </q-list>
  </q-page>
</template>

<script>
const pcs = [{
  id: 1,
  name: 'Ruddy Jedrzej',
  owner: 'rjedrzej0@discuz.net',
  letter: 'R'
}, {
  id: 2,
  name: 'Mallorie Alessandrini',
  owner: 'malessandrini1@marketwatch.com',
  letter: 'M'
}, {
  id: 3,
  name: 'Elisabetta Wicklen',
  owner: 'ewicklen2@microsoft.com',
  letter: 'E'
}, {
  id: 4,
  name: 'Seka Fawdrey',
  owner: 'sfawdrey3@wired.com',
  letter: 'S'
}]

const npcs = [{
  id: 5,
  name: 'Brunhilde Panswick',
  owner: 'bpanswick4@csmonitor.com',
  avatar: 'avatar2.jpg'
}, {
  id: 6,
  name: 'Winfield Stapforth',
  owner: 'wstapforth5@pcworld.com',
  avatar: 'avatar6.jpg'
}]

export default {
  data () {
    return {
      pcs,
      npcs
    }
  },
  components: {
    'unit-card': require('components/UnitCard').default
  }
}
</script>
