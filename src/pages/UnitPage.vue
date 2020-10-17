<template>
  <unit-card :unit="unit" />
</template>

<script>
const unit = {
  name: 'Ike',
  owner: 'Gabriel',
  avatar: 'https://cdn.quasar.dev/img/parallax1.jpg',
  hpCur: 20,
  hpMax: 20,
  atk: 20,
  vit: 20,
  tec: 20,
  def: 20,
  res: 20,
  cha: 20,
}

export default {
  data () {
    return {
      unit
    }
  },
  components: {
    'unit-card': require('components/UnitCard.vue').default
  }
}
</script>
