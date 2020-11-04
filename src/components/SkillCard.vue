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
      <q-item-label class="row items-center justify-center">
        <div class="col">{{skill.name}}</div>
        <div class=".col text-caption text-italic">{{skillTypes[skill.type]}}</div>
      </q-item-label>

      <q-item-label
        caption
        v-if="skill.description"
      >{{skill.description}}</q-item-label>

      <q-item-label
        v-if="skill.type === 'styles'"
        class="row justify-between"
        caption
      >
        <template v-for="(statName, statKey) in allStatNames">
          <div
            :key="statKey+'_label'"
            class="col-2"
          >{{statName}}</div>
          <div
            :key="statKey+'_value'"
            class="col-1 text-right"
          >{{skill.stats[statKey]?skill.stats[statKey]:0}}</div>
          <div
            :key="statKey+'_space'"
            class="col-1"
          />
        </template>
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
      allStatNames: {
        hpMax: "HP",
        str: "FOR",
        mag: "MAG",
        spd: "VIT",
        skl: "TEC",
        lck: "CHA",
        def: "DEF",
        res: "RES",
        mov: "MOV",
      },
      skillTypes: {
        styles: "Style",
        assists: "Action",
        skills: "Compétence",
        crits: "Critique",
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