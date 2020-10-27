<template>
  <q-item
    class="q-pa-none q-ma-none"
    v-if="skill"
  >
    <q-item-section avatar>
      <q-avatar v-if="skill.icon">
        <img
          :src="skill.icon"
          class="pixelated"
        />
      </q-avatar>
      <q-avatar
        v-else
        icon="not_interested"
        color="primary"
        text-color="white"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{skill.name}}</q-item-label>

      <q-item-label
        caption
        v-if="skill.description"
      >{{skill.description}}</q-item-label>

      <q-item-label
        caption
        v-if="skill.type === 'styles'"
      >
        <div class="row">
          <div
            class="col-3"
            v-for="(statName, statKey) in statNames"
            :key="statKey"
          >
            {{statName}} : {{skill.stats[statKey]?skill.stats[statKey]:0}}
          </div>
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['skillKey'],
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
      }
    }
  },
  computed: {
    ...mapState('UserStore', ['userDetails']),
    ...mapState('StaticStore', ['skills']),
    skill () {
      let s = { name: "Aucune" }
      if (this.skills[this.skillKey]) {
        s = this.skills[this.skillKey]
      }
      return s
    }
  },
}
</script>

<style lang="stylus">
.pixelated {
  image-rendering: pixelated;
}
</style>