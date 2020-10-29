<template>
  <q-item
    class="q-pa-none q-ma-none"
    v-if="item"
  >
    <q-item-section avatar>
      <q-avatar
        v-if="item.icon"
        square
      >
        <img
          class="pixelated"
          :src="item.icon"
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
      <q-item-label class="row">
        <div class=".col">{{item.name}}
        </div>
        <q-rating
          v-if="item && item.level"
          class=".col q-mx-sm"
          :value="parseInt(item.level)"
          max="3"
          color="primary"
          readonly
        />
      </q-item-label>
      <q-item-label
        class="row"
        caption
        v-if="itemType === 'weapons' && item.atk"
      >
        <div
          class="col-6"
          v-if="item.damage === 'MAG'"
        >Magique</div>
        <div
          class="col-6"
          v-else
        >Physique</div>
        <div class="col-6">POR {{item['por-min']}} - {{item['por-max']}}</div>
        <div class="col-6">ATQ {{item.atk}}</div>
        <div class="col-6">PRC {{item.hit}}</div>
        <div class="col-6">CRIT {{item.crit}}</div>
        <div class="col-6">VIT {{item.spd}}</div>
      </q-item-label>
      <q-item-label
        v-if="itemType !== 'weapons' && item.stats"
        class="row"
        caption
      >
        <div
          class="col-6"
          v-for="(statName, statKey) in statNames"
          :key="statKey"
        >
          {{statName}} : {{item.stats[statKey]?item.stats[statKey]:0}}
        </div>
      </q-item-label>
      <q-item-label
        caption
        v-if="item.description"
      >{{item.description}}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['itemType', 'itemKey'],
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
    ...mapState('StaticStore', ['items']),
    item () {
      let i = { name: "Aucune" }
      if (this.items[this.itemType] && this.items[this.itemType][this.itemKey]) {
        i = this.items[this.itemType][this.itemKey]
      }
      return i
    }
  },
}
</script>

<style lang="stylus">
.pixelated {
  image-rendering: pixelated;
}
</style>