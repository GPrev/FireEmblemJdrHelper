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
          v-if="item.magical"
        >Magique</div>
        <div
          class="col-6"
          v-else
        >Physique</div>
        <div class="col-3">POR</div>
        <div class="col-2 text-right">{{item['por-min']}} - {{item['por-max']}}</div>
        <div class="col-3">ATQ</div>
        <div class="col-2 text-right">{{item.atk}}</div>
        <div class="col-1" />
        <div class="col-3">PRC</div>
        <div class="col-2 text-right">{{item.hit}}%</div>
        <div class="col-3">VIT</div>
        <div class="col-2 text-right">{{item.spd}}</div>
        <div class="col-1" />
        <div class="col-3">CRIT</div>
        <div class="col-2 text-right">{{item.crit}}%</div>
      </q-item-label>
      <q-item-label
        v-if="itemType !== 'weapons' && item.stats"
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
          >{{item.stats[statKey]?item.stats[statKey]:0}}</div>
          <div
            :key="statKey+'_space'"
            class="col-1"
          />
        </template>
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